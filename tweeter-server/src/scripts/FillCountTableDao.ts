import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Count } from "../entities/Count";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


export class FillCountsTableDao {
  private readonly tableName = "counts";
  private readonly userAliasAttr = "user_alias";
  private readonly followerCountAttr = "follower_count";
  private readonly followeeCountAttr = "followee_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  /**
   * Batch-create Count items (25 at a time)
   */
  async createCounts(countList: Count[]) {
    if (countList.length === 0) {
      console.log("Zero count entries to batch write");
      return;
    }

    const chunkSize = 25;

    for (let i = 0; i < countList.length; i += chunkSize) {
      const chunk = countList.slice(i, i + chunkSize);
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: chunk.map((count) => ({
            PutRequest: {
              Item: {
                [this.userAliasAttr]: count.userAlias,
                [this.followerCountAttr]: count.followerCount,
                [this.followeeCountAttr]: count.followeeCount,
              },
            },
          })),
        },
      };

      try {
        const resp = await this.client.send(new BatchWriteCommand(params));
        await this.retryUnprocessed(resp, params);
      } catch (err) {
        throw new Error(
          `Error batch writing counts with params: ${JSON.stringify(params)}\n${err}`
        );
      }
    }
  }

  /**
   * Insert a single Count entry (initial creation)
   */
  async addInitialCount(alias: string, followerCount: number = 0, followeeCount: number = 1) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.userAliasAttr]: alias,
        [this.followerCountAttr]: followerCount,
        [this.followeeCountAttr]: followeeCount,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  /**
   * Increase a user's follower_count by an arbitrary amount
   * Used when loading bulk data.
   */
  async increaseFollowersCount(alias: string, count: number): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: { [this.userAliasAttr]: alias },
      UpdateExpression: `SET ${this.followerCountAttr} = ${this.followerCountAttr} + :inc`,
      ExpressionAttributeValues: { ":inc": count },
    };

    try {
      await this.client.send(new UpdateCommand(params));
      return true;
    } catch (err) {
      console.error("Error updating followers count:", err);
      return false;
    }
  }

  /**
   * Retry logic for unprocessed batch items
   */
  private async retryUnprocessed(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 25;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (delay < 1000) delay += 50;
      }

      console.log(
        `Attempt ${attempts}: retrying ${Object.keys(resp.UnprocessedItems).length} unprocessed count items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
