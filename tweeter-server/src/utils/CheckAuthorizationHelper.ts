import { TweeterRequest } from "tweeter-shared";

export const checkAuthorizationHelper = (request: TweeterRequest): void => {
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }
}
