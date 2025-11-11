import { TweeterRequest, UserItemCountResponse } from "tweeter-shared";

export const helper = async (request: TweeterRequest, getCountFunction: () => Promise<any>): Promise<UserItemCountResponse> => {
    if (!request.token || !request.userAlias) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

    const count = await getCountFunction();

    return {
        success: true,
        message: null, 
        count: count
    }
}
