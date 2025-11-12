import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { checkAuthorizationHelper } from "../../utils/CheckAuthorizationHelper";
import { checkRequestHelper } from "../../utils/CheckRequestHelper";
import PostService from "../../services/PostService";

export const handler = async(request: PostStatusRequest): Promise<TweeterResponse> => {
    checkRequestHelper(request);
    if (!request.status) { throw new Error("Bad Request: the request does not include all required parameters"); }
    checkAuthorizationHelper(request);

    const postService: PostService = new PostService();
    await postService.postStatus(request.token, request.userAlias, request.status);

     return {
        success: true,
        message: null
    }
}
