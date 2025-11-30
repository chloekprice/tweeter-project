import { TweeterRequest, TweeterResponse } from "tweeter-shared"
import { checkRequestHelper } from "../../utils/CheckRequestHelper"
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import AuthenticationService from "../../services/AuthenticationService";
import { DynamoDatabaseFactory } from "../../daos/DynamoDatabaseFactory";

export const handler = async(request: TweeterRequest): Promise<TweeterResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
    const authService = new AuthenticationService(databaseProvider);
    await authService.logUserOut(request.token, request.userAlias);

    return {
        success: true,
        message: null
    }
}
