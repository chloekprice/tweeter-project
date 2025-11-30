import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Session } from "../../entities/Session";
import { SessionsDao } from "./SessionsDao";

export class DynamoSessionsDao implements SessionsDao  {
    readonly tableName = "sessions";
    readonly indexName = "session-gs-index";
    readonly tokenAttr = "token";
    readonly aliasAttr = "alias";
    readonly lastActivityAttr = "last_activity_timestamp";
    readonly ttlAttr = "ttl";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


    async addSession(session: Session): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.tokenAttr]: session.token,
                [this.aliasAttr]: session.alias,
                [this.lastActivityAttr]: session.lastActivityTimestamp,
                [this.ttlAttr]: session.ttl
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async deleteSession(token: string, alias: string): Promise<void> {
        const deleteParamas = {
            TableName: this.tableName,
            Key: this.generateSessionItem(token),
        };

        await this.client.send(new DeleteCommand(deleteParamas));

        const queryParams = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: `${this.aliasAttr} = :alias`,
            ExpressionAttributeValues: {
                ":alias": alias
            }
        };

        const sessions = await this.client.send(new QueryCommand(queryParams));
        
        const deletePromises = (sessions.Items ?? []).map(item =>
            this.client.send(new DeleteCommand({
                TableName: this.tableName,
                Key: this.generateSessionItem(item.token)
            }))
        );

        await Promise.all(deletePromises);
    }

    async getSession(token: string): Promise<Session | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateSessionItem(token),
        };

        const output = await this.client.send(new GetCommand(params));

        return output.Item == undefined
        ? undefined
        : new Session(
            output.Item[this.tokenAttr],
            output.Item[this.aliasAttr],
            output.Item[this.lastActivityAttr],
            output.Item[this.ttlAttr]
        );
    }


    private generateSessionItem(token: string) {
        return {
            [this.tokenAttr]: token
        };
    }

}
