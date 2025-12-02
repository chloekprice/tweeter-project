import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "../../entities/User";
import { UsersDao } from "./UsersDao";


export class DynamoUsersDao implements UsersDao {
    readonly tableName = "users";
    readonly indexName = "users-gs-index";
    readonly aliasAttr = "alias";
    readonly firstNameAttr = "first_name";
    readonly lastNameAttr = "last_name";
    readonly passwordHashAttr = "password_hash";
    readonly imageUrlAttr = "image_url";

    private readonly client;

    public constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }
    
    async addUser(user: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.aliasAttr]: user.alias,
                [this.firstNameAttr]: user.firstName,
                [this.lastNameAttr]: user.lastName,
                [this.passwordHashAttr]: user.passwordHash,
                [this.imageUrlAttr]: user.imageUrl
            },
        };

        await this.client.send(new PutCommand(params));
    }

    async deleteUser(alias: string): Promise<void> {
        const deleteParamas = {
            TableName: this.tableName,
            Key: this.generateUserItem(alias),
        };

        await this.client.send(new DeleteCommand(deleteParamas));
    }

    async getUser(alias: string): Promise<User | null> {
        const params = {
            TableName: this.tableName,
            Key: this.generateUserItem(alias),
        };

        const output = await this.client.send(new GetCommand(params));

        return output.Item == undefined
        ? null
        : new User(
            output.Item[this.aliasAttr],
            output.Item[this.firstNameAttr],
            output.Item[this.lastNameAttr],
            output.Item[this.passwordHashAttr],
            output.Item[this.imageUrlAttr]
        );
    }


    private generateUserItem(alias: string) {
        return {
            [this.aliasAttr]: alias
        };
    }
    
}
