import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../entities/DataPage";
import { FollowsDao } from "./FollowsDao";
import { Follow } from "../../entities/Follow";


export class DynamoFollowsDao implements FollowsDao {
    readonly tableName = "follows";
    readonly indexName = "followee_handle-follower_handle-index";
    readonly followeeHandleAttr = "followee_handle";
    readonly followerHandleAttr = "follower_handle";
    readonly followeeNameAttr = "followee_name";
    readonly followerNameAttr = "follower_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async addFollow(follow: Follow): Promise<void> {
        const followInDatabase: Follow | undefined = await this.getFollow(follow);
        if (followInDatabase !== undefined) {
            if (follow.followeeName == followInDatabase.followeeName) {
                await this.updateFollower(follow);
            } else {
                await this.updateFollowee(follow);
            }
            } else {
            await this.putFollow(follow);
        }
    }

    async deleteFollow(follow: Follow): Promise<void> {
        const params = {
        TableName: this.tableName,
        Key: this.generateFollowItem(follow),
        };
        await this.client.send(new DeleteCommand(params));
    }

    async getFollow(follow: Follow): Promise<Follow | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
        ? undefined
        : new Follow(
            output.Item[this.followeeNameAttr],
            output.Item[this.followerNameAttr],
            output.Item[this.followeeHandleAttr],
            output.Item[this.followerHandleAttr]
            );
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + " = :follower",
            ExpressionAttributeValues: {
                ":follower": followerHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey: 
                lastFolloweeHandle === undefined 
                ? undefined : {
                    [this.followerHandleAttr]: followerHandle,
                    [this.followeeHandleAttr]: lastFolloweeHandle
                },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach( (item) =>
        items.push(new Follow(
            item[this.followeeNameAttr],
            item[this.followerNameAttr],
            item[this.followeeHandleAttr],
            item[this.followerHandleAttr]
        ))
        )

        return new DataPage<Follow>(items, hasMorePages);
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + " = :followee",
            ExpressionAttributeValues: {
                ":followee": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey: 
                lastFollowerHandle === undefined 
                ? undefined : {
                    [this.followerHandleAttr]: lastFollowerHandle,
                    [this.followeeHandleAttr]: followeeHandle
                },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach( (item) =>
        items.push(new Follow(
            item[this.followeeNameAttr],
            item[this.followerNameAttr],
            item[this.followeeHandleAttr],
            item[this.followerHandleAttr]
        ))
        )

        return new DataPage<Follow>(items, hasMorePages);
    }


    private async putFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followeeNameAttr]: follow.followeeName,
                [this.followerNameAttr]: follow.followerName, 
                [this.followeeHandleAttr]: follow.followeeHandle,
                [this.followerHandleAttr]: follow.followerHandle,
            },
        };
        await this.client.send(new PutCommand(params));
    }


    private generateFollowItem(follow: Follow) {
        return {
            [this.followeeHandleAttr]: follow.followeeHandle,
            [this.followerHandleAttr]: follow.followerHandle,
        };
    }

    private async updateFollowee(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
            ExpressionAttributeValues: { ":val": follow.followeeName },
            UpdateExpression: `SET ${this.followeeNameAttr} = :val`,
        };
        await this.client.send(new UpdateCommand(params));
    }

    private async updateFollower(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
            ExpressionAttributeValues: { ":val": follow.followerName },
            UpdateExpression: `SET ${this.followerNameAttr} = :val`,
        };
        await this.client.send(new UpdateCommand(params));
    }
}
