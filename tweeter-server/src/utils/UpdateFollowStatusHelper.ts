import { TweeterRequest, UpdateFollowStatusResponse } from "tweeter-shared";

export const helper = async (request: TweeterRequest, updateFunction: () => Promise<[number, number]> ): Promise<UpdateFollowStatusResponse> => {
    if (!request.token || !request.userAlias) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

    const [followerCount, followeeCount] = await updateFunction();

    return {
        success: true,
        message: null, 
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}
