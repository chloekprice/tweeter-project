import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";
import { helper } from "../../utils/GetUserItemCountHelper"
import UserService from "../../services/UserService";
import { DynamoDatabaseFactory } from "../../daos/DynamoDatabaseFactory";

const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
const userService = new UserService(databaseProvider);

export const handler = async (request: TweeterRequest): Promise<UserItemCountResponse> => {
    return await helper(request, async (token: string, userAlias: string) => {

        return await userService.getFolloweeCount(token, userAlias);
    });
}
