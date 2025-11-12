import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import FollowService from "../../services/FollowService";
import { helper } from "../../utils/GetUserItemsHelper"

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    return await helper(request, async (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => {
        const followService = new FollowService();
        return await followService.loadMoreFollowees(token, userAlias, pageSize, lastItem)
    });
}
