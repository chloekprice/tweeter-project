import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { helper } from "../../utils/GetItemsHelper"
import StatusService from "../../services/StatusService";
import { DynamoDatabaseFactory } from "../../daos/DynamoDatabaseFactory";

export const handler = async (request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    return await helper<StatusDto>(request, async (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null) => {
        const databaseProvider: DynamoDatabaseFactory = new DynamoDatabaseFactory();
        const statusService = new StatusService(databaseProvider);
        return await statusService.loadMoreFeedStatuses(token, userAlias, pageSize, lastItem);
    });
}
