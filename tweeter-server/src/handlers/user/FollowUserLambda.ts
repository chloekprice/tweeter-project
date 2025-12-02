import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";
import { helper } from "../../utils/UpdateFollowStatusHelper"
import UserService from "../../services/UserService";
import { DynamoDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
const userService = new UserService(databaseProvider);

export const handler = async (request: TweeterRequest): Promise<UpdateFollowStatusResponse> => {
    return await helper(request, async (token: string, userAlias: string) => {
        return await userService.follow(token, userAlias);
    });
}
