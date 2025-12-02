import { GetUserResponse, TweeterRequest, UserDto } from "tweeter-shared"
import UserService from "../../services/UserService";
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import { checkRequestHelper } from "../../utils/CheckRequestHelper";
import { DynamoDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
const userService = new UserService(databaseProvider);

export const handler = async (request: TweeterRequest): Promise<GetUserResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    const userDto: UserDto | null = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        message: null, 
        user: userDto
    }
}
