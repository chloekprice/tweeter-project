import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import FollowService from "../../services/FollowService";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    if (!request.token || !request.userAlias || !request.pageSize) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

    const followService = new FollowService();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem)

    return {
        success: true,
        message: null, 
        items: items,
        hasMore: hasMore
    }
}
