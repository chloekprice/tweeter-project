import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import UserService from "../../services/UserService";
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import { checkRequestHelper } from "../../utils/CheckRequestHelper";
import { AmazonDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: AmazonDatabaseFactory = new AmazonDatabaseFactory();
const userService = new UserService(databaseProvider);

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
    checkRequestHelper(request);
    if (!request.selectedUserAlias) { throw new Error("Bad Request: the request does not include all required parameters"); }
    checkAuthorizationHelper(request);

    const isFollowing = await userService.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias);

    return {
        success: true,
        message: null, 
        isFollowing: isFollowing
    }
}
