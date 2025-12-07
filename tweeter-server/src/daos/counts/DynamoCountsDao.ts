import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { CountsDao } from "./CountsDao";
import { Count } from "../../entities/Count";

export class DynamoCountsDao implements CountsDao  {
    readonly tableName = "counts";
    readonly aliasAttr = "user_alias";
    readonly followeeCountAttr = "followee_count";
    readonly followerCountAttr = "follower_count";

    private readonly client;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    async addCount(count: Count): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.aliasAttr]: count.userAlias,
                [this.followeeCountAttr]: count.followeeCount,
                [this.followerCountAttr]: count.followerCount
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getCount(alias: string): Promise<Count | undefined> {
        const params = {
            TableName: this.tableName,
            Key: { [this.aliasAttr]: alias }
        };
        
        const output = await this.client.send(new GetCommand(params));
        
        return output.Item == undefined
        ? undefined
        : new Count(
            output.Item[this.aliasAttr],
            output.Item[this.followeeCountAttr],
            output.Item[this.followerCountAttr]
        );
    }

    async updateFolloweeCount(count: Count, isIncreasing: boolean): Promise<void> {
        const increaseValue = isIncreasing ? "1" : "-1"

        const params = {
            TableName: this.tableName,
            Key: { [this.aliasAttr]: count.userAlias },
            ExpressionAttributeNames: { "count": this.followeeCountAttr },
            UpdateExpression: "ADD #count :inc",
            ExpressionAttributeValues: { ":inc": { N: increaseValue } }
        };
        await this.client.send(new UpdateCommand(params));
    }

    async updateFollowerCount(count: Count, isIncreasing: boolean): Promise<void> {
        const increaseValue = isIncreasing ? "1" : "-1"
        
        const params = {
            TableName: this.tableName,
            Key: { [this.aliasAttr]: count.userAlias },
            ExpressionAttributeNames: { "count": this.followerCountAttr },
            UpdateExpression: "ADD #count :inc",
            ExpressionAttributeValues: { ":inc": { N: increaseValue } }
        };
        await this.client.send(new UpdateCommand(params));
    }
}
