import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import FollowService from "../../services/FollowService";
import { helper } from "../../utils/GetUserItemsHelper"

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    return await helper(request, async (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => {
        const followService = new FollowService();
        return await followService.loadMoreFollowers(token, userAlias, pageSize, lastItem)
    });
}
