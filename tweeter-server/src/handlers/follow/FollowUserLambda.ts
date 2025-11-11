import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";
import { helper } from "../../utils/UpdateFollowStatusHelper"
import UserService from "../../services/UserService";

export const handler = async (request: TweeterRequest): Promise<UpdateFollowStatusResponse> => {
    return await helper(request, async () => {
        const userService: UserService = new UserService();
        return await userService.follow(request.token, request.userAlias);
    });
}
