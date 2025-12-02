import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
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

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
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
