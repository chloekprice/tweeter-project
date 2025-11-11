import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";
import { helper } from "../../utils/GetUserItemCountHelper"
import UserService from "../../services/UserService";

export const handler = async (request: TweeterRequest): Promise<UserItemCountResponse> => {
    return await helper(request, async () => {
        const userService = new UserService();
        return await userService.getFollowerCount(request.token, request.userAlias);
    });
}
