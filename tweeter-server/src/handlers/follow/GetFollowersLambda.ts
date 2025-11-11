import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import FollowService from "../../services/FollowService";
import { helper } from "../../utils/GetUserItemsHelper"

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    return await helper(request, async () => {
        const followService = new FollowService();
        return await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem)
    });
}
