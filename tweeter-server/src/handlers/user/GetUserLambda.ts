import { GetUserResponse, TweeterRequest, UserDto } from "tweeter-shared"
import UserService from "../../services/UserService";
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import { checkRequestHelper } from "../../utils/CheckRequestHelper";

export const handler = async (request: TweeterRequest): Promise<GetUserResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    const userService: UserService = new UserService();
    const userDto: UserDto | null = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        message: null, 
        user: userDto
    }
}
