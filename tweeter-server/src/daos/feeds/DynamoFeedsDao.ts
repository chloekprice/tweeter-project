import {
    BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../../entities/DataPage";
import { FeedsDao } from "./FeedsDao";
import { Feed } from "../../entities/Feed";

export class DynamoFeedsDao implements FeedsDao {
    readonly tableName = "feeds";
    readonly indexName = "feed-gs-index";
    readonly userAliasAttr = "user_alias";
    readonly userAttr = "user";
    readonly timestampAttr = "timestamp";
    readonly statusAttr = "status";

    private readonly client;

    readonly batchSize = 25;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }


    async batchAddToFeed(feedPosts: Feed[]): Promise<void> {
        for (let i = 0; i < feedPosts.length; i += this.batchSize) {
            const chunk = feedPosts.slice(i, i + this.batchSize);

            const requestItems = chunk.map(feedPost => ({
                PutRequest: {
                    Item: {
                        [this.userAliasAttr]: feedPost.userAlias,
                        [this.userAttr]: feedPost.user,
                        [this.timestampAttr]: feedPost.timestamp,
                        [this.statusAttr]: feedPost.status
                    }
                }
            }));

            const params = {
                RequestItems: {
                    [this.tableName]: requestItems
                }
            };

            let response = await this.client.send(new BatchWriteCommand(params));

            // Retry any unprocessed items (DynamoDB throttling happens)
            while (response.UnprocessedItems && 
                Object.keys(response.UnprocessedItems).length > 0) {

                console.warn("Retrying unprocessed feed items...");

                response = await this.client.send(new BatchWriteCommand({
                    RequestItems: response.UnprocessedItems
                }));
            }
        }
    }


    async addToFeed(feedPost: Feed): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.userAliasAttr]: feedPost.userAlias,
                [this.userAttr]: feedPost.user,
                [this.timestampAttr]: feedPost.timestamp,
                [this.statusAttr]: feedPost.status
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getPageOfFeeds(userAlias: string, pageSize: number, lastItem: Feed | undefined): Promise<DataPage<Feed>> {
        const params = {
            KeyConditionExpression: `${this.userAliasAttr} = :alias`,
            ExpressionAttributeValues: {
                ":alias": userAlias,
            },
            TableName: this.tableName, // PRIMARY TABLE
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: 
                lastItem === undefined 
                ? undefined : {
                    [this.userAliasAttr]: userAlias, // PARTITION
                    [this.timestampAttr]: lastItem.timestamp // SORT
                },
        };

        const items: Feed[] = [];
        const data = await this.client.send(new QueryCommand(params));

        data.Items?.forEach( (item) =>
            items.push(new Feed(
                item[this.userAliasAttr] ?? "",
                item[this.userAttr] ?? "",
                item[this.timestampAttr] ?? "",
                item[this.statusAttr] ?? ""
            ))
        )

        const hasMorePages = data.LastEvaluatedKey !== undefined;

        return new DataPage<Feed>(items, hasMorePages);
    }

}
