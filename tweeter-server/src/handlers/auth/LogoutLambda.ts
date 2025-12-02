import { TweeterRequest, TweeterResponse } from "tweeter-shared"
import { checkRequestHelper } from "../../utils/CheckRequestHelper"
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import AuthenticationService from "../../services/AuthenticationService";
import { DynamoDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

let databaseProvider: DynamoDatabaseFactory;
let authService: AuthenticationService;

export const handler = async(request: TweeterRequest): Promise<TweeterResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    if (!databaseProvider) {
        databaseProvider = new DynamoDatabaseFactory();
        authService = new AuthenticationService(databaseProvider);
    }

    await authService.logUserOut(request.token, request.userAlias);

    return {
        success: true,
        message: null
    }
}
