import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import FollowService from "../../services/FollowService";
import { helper } from "../../utils/GetItemsHelper"
import { AmazonDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: AmazonDatabaseFactory = new AmazonDatabaseFactory();
const followService = new FollowService(databaseProvider);

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    return await helper<UserDto>(request, async (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => {
        return await followService.loadMoreFollowers(token, userAlias, pageSize, lastItem)
    });
}
