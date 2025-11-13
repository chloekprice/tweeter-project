import { TweeterRequest } from "tweeter-shared";

export const checkRequestHelper = (request: TweeterRequest): void => {
    if (!request.token || !request.userAlias) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
}
