import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";
import { checkAuthorizationHelper } from "./CheckAuthorizationHelper";
import { checkRequestHelper } from "./CheckRequestHelper";

export const helper = async (request: TweeterRequest, getCountFunction: (token: string, userAlias: string) => Promise<any>): Promise<UserItemCountResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    const count = await getCountFunction(request.token, request.userAlias);

    return {
        success: true,
        message: null, 
        count: count
    }
}
