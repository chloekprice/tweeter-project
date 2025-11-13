import { TweeterRequest, TweeterResponse } from "tweeter-shared"
import { checkRequestHelper } from "../../utils/CheckRequestHelper"
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import AuthenticationService from "../../services/AuthenticationService";

export const handler = async(request: TweeterRequest): Promise<TweeterResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    const authService: AuthenticationService = new AuthenticationService();
    authService.logUserOut(request.token, request.userAlias);

    return {
        success: true,
        message: null
    }
}
