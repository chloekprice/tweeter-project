import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";
import { checkAuthorizationHelper } from "./CheckAuthorizationHelper";
import { checkRequestHelper } from "./CheckRequestHelper";

export const helper = async (request: TweeterRequest, updateFunction: (token: string, userAlias: string) => Promise<[number, number]> ): Promise<UpdateFollowStatusResponse> => {
    checkRequestHelper(request);
    checkAuthorizationHelper(request);

    // Remove once there is a call to follow/unfollow
    await new Promise((f) => setTimeout(f, 2000));

    const [followerCount, followeeCount] = await updateFunction(request.token, request.userAlias);

    return {
        success: true,
        message: null, 
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}
