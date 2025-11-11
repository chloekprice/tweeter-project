import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";

export const helper = async (request: TweeterRequest, updateFunction: (token: string, userAlias: string) => Promise<[number, number]> ): Promise<UpdateFollowStatusResponse> => {
    if (!request.token || !request.userAlias) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

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
