import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";
import { helper } from "../../utils/GetUserItemCountHelper"
import UserService from "../../services/UserService";
import { AmazonDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: AmazonDatabaseFactory = new AmazonDatabaseFactory();
const userService = new UserService(databaseProvider);

export const handler = async (request: TweeterRequest): Promise<UserItemCountResponse> => {
    return await helper(request, async (token: string, userAlias: string) => {
        return await userService.getFollowerCount(token, userAlias);
    });
}
