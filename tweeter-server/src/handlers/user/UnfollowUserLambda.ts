import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";
import { helper } from "../../utils/UpdateFollowStatusHelper"
import UserService from "../../services/UserService";

export const handler = async (request: TweeterRequest): Promise<UpdateFollowStatusResponse> => {
    return await helper(request, async (token: string, userAlias: string) => {
        const userService: UserService = new UserService();
        return await userService.unfollow(token, userAlias);
    });
}
