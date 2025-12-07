import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../../entities/DataPage";
import { FollowsDao } from "./FollowsDao";
import { Follow } from "../../entities/Follow";


interface FollowParams {
    KeyConditionExpression: string;
    ExpressionAttributeValues: { [key: string]: string };
    TableName: string;
    IndexName?: string;
    Limit: number;
    ExclusiveStartKey?: { [key: string]: string };
}


export class DynamoFollowsDao implements FollowsDao {
    readonly tableName = "follows";
    readonly indexName = "follow-gs-index";
    readonly followeeHandleAttr = "followee_handle";
    readonly followerHandleAttr = "follower_handle";
    readonly followeeFirstNameAttr = "followee_first_name";
    readonly followerFirstNameAttr = "follower_first_name";
    readonly followeeLastNameAttr = "followee_last_name";
    readonly followeeImageUrlAttr = "followee_image_url";
    readonly followerLastNameAttr = "follower_last_name";
    readonly followerImageUrlAttr = "follower_image_url";

    private readonly client;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }


    async addFollow(follow: Follow): Promise<void> {
        const followInDatabase: Follow | undefined = await this.getFollow(follow);

        if (followInDatabase !== undefined) {
            if (
                follow.followeeFirstName != followInDatabase.followeeFirstName ||
                follow.followeeLastName != followInDatabase.followeeLastName
            ) { 
                await this.updateFollowee(follow); 
            } else if (
                follow.followerFirstName != followInDatabase.followerFirstName ||
                follow.followerLastName != followInDatabase.followerLastName
            ) { 
                await this.updateFollower(follow); 
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
            output.Item[this.followeeHandleAttr],
            output.Item[this.followeeFirstNameAttr],
            output.Item[this.followeeLastNameAttr],
            output.Item[this.followeeImageUrlAttr],
            output.Item[this.followerHandleAttr],
            output.Item[this.followerFirstNameAttr],
            output.Item[this.followerLastNameAttr],
            output.Item[this.followerImageUrlAttr]
        );
    }

    async getFollowers(alias: string): Promise<string[]> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            IndexName: this.indexName, // GSI
            KeyConditionExpression: `${this.followeeHandleAttr} = :alias`,
            ExpressionAttributeValues: { ":alias": alias }
        };

        const items: string[] = [];
        const result = await this.client.send(new QueryCommand(params));

        result.Items?.forEach( (item) =>
            items.push(item[this.followerHandleAttr] ?? "")
        )

        return items;
    }

    async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: `${this.followerHandleAttr} = :follower`,
            ExpressionAttributeValues: {
                ":follower": followerHandle,
            },
            TableName: this.tableName, // PRIMARY TABLE
            Limit: pageSize,
            ExclusiveStartKey: 
                lastFolloweeHandle === undefined 
                ? undefined : {
                    [this.followerHandleAttr]: followerHandle, // PARTITION
                    [this.followeeHandleAttr]: lastFolloweeHandle // SORT
                },
        };

        return this.getPageOfUsers(params);
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: `${this.followeeHandleAttr} = :followee`,
            ExpressionAttributeValues: {
                ":followee": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName, // GSI
            Limit: pageSize,
            ExclusiveStartKey: 
                lastFollowerHandle === undefined 
                ? undefined : {
                    [this.followeeHandleAttr]: followeeHandle, // PARTITION IN GSI
                    [this.followerHandleAttr]: lastFollowerHandle // SORT IN GSI
                },
        };

       return this.getPageOfUsers(params);
    }



    private generateFollowItem(follow: Follow) {
        return {
            [this.followerHandleAttr]: follow.followerHandle,
            [this.followeeHandleAttr]: follow.followeeHandle
        };
    }

    private async getPageOfUsers(parameters: FollowParams): Promise<DataPage<Follow>> {
        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(parameters));

        data.Items?.forEach( (item) =>
            items.push(new Follow(
                item[this.followeeHandleAttr] ?? "",
                item[this.followeeFirstNameAttr] ?? "",
                item[this.followeeLastNameAttr] ?? "",
                item[this.followeeImageUrlAttr] ?? "",
                item[this.followerHandleAttr] ?? "",
                item[this.followerFirstNameAttr] ?? "",
                item[this.followerLastNameAttr] ?? "",
                item[this.followerImageUrlAttr] ?? ""
            ))
        )

        const hasMorePages = data.LastEvaluatedKey !== undefined;

        return new DataPage<Follow>(items, hasMorePages);
    }

    private async putFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandleAttr]: follow.followerHandle,
                [this.followeeHandleAttr]: follow.followeeHandle,
                [this.followerFirstNameAttr]: follow.followerFirstName,
                [this.followerLastNameAttr]: follow.followerLastName,
                [this.followerImageUrlAttr]: follow.followerImageUrl,
                [this.followeeFirstNameAttr]: follow.followeeFirstName,
                [this.followeeLastNameAttr]: follow.followeeLastName,
                [this.followeeImageUrlAttr]: follow.followeeImageUrl,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    private async updateFollowee(follow: Follow): Promise<void> {
        await this.updateUser(follow, this.followeeFirstNameAttr, follow.followeeFirstName, this.followeeLastNameAttr, follow.followeeLastName);
    }

    private async updateFollower(follow: Follow): Promise<void> {
        await this.updateUser(follow, this.followerFirstNameAttr, follow.followerFirstName, this.followerLastNameAttr, follow.followerLastName);
    }

    private async updateUser(follow: Follow, firstNameAttr: string, updatedFirstName: string, lastNameAttr: string, updatedLastName: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
            ExpressionAttributeValues: { ":val1": updatedFirstName, ":val2": updatedLastName },
            UpdateExpression: `SET ${firstNameAttr} = :val1, ${lastNameAttr} = :val2`,
        };
        await this.client.send(new UpdateCommand(params));
    }
}
