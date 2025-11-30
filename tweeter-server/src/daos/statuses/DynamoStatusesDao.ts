import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../entities/DataPage";
import { Status } from "../../entities/Status";
import { StatusesDao } from "./StatusesDao";

export class DynamoStatusesDao implements StatusesDao {
    readonly tableName = "statuses";
    readonly indexName = "status-gs-index";
    readonly userAliasAttr = "user_alias";
    readonly timestampAttr = "timestamp";
    readonly postAttr = "post";
    readonly segmentsAttr = "segments";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    
    async addStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.userAliasAttr]: status.userAlias,
                [this.timestampAttr]: status.timestamp,
                [this.postAttr]: status.post,
                [this.segmentsAttr]: status.segments
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getPageOfStatuses(userAlias: string, pageSize: number, lastItem: Status | undefined): Promise<DataPage<Status>> {
        const params = {
            KeyConditionExpression: `${this.userAliasAttr} = :alias`,
            ExpressionAttributeValues: {
                ":alias": userAlias,
            },
            TableName: this.tableName, // PRIMARY TABLE
            Limit: pageSize,
            ExclusiveStartKey: 
                lastItem === undefined 
                ? undefined : {
                    [this.userAliasAttr]: userAlias, // PARTITION
                    [this.timestampAttr]: lastItem.timestamp // SORT
                },
        };

        const items: Status[] = [];
        const data = await this.client.send(new QueryCommand(params));

        data.Items?.forEach( (item) =>
            items.push(new Status(
                item[this.userAliasAttr] ?? "",
                item[this.timestampAttr] ?? "",
                item[this.postAttr] ?? "",
                item[this.segmentsAttr] ?? ""
            ))
        )

        const hasMorePages = data.LastEvaluatedKey !== undefined;

         return new DataPage<Status>(items, hasMorePages);
    }
    
}
