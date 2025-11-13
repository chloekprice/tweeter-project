import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";
import { helper } from "../../utils/GetUserItemCountHelper"
import UserService from "../../services/UserService";

export const handler = async (request: TweeterRequest): Promise<UserItemCountResponse> => {
    return await helper(request, async (token: string, userAlias: string) => {
        const userService = new UserService();
        return await userService.getFollowerCount(token, userAlias);
    });
}
