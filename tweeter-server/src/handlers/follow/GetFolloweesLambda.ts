import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import FollowService from "../../services/FollowService";
import { helper } from "../../utils/GetItemsHelper"
import { DynamoDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
const followService = new FollowService(databaseProvider);

export const handler = async (request: PagedItemRequest<UserDto>): Promise<PagedItemResponse<UserDto>> => {
    return await helper<UserDto>(request, async (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => {
        return await followService.loadMoreFollowees(token, userAlias, pageSize, lastItem)
    });
}
