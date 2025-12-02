import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { helper } from "../../utils/GetItemsHelper"
import StatusService from "../../services/StatusService";
import { AmazonDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

const databaseProvider: AmazonDatabaseFactory = new AmazonDatabaseFactory();
const statusService = new StatusService(databaseProvider);

export const handler = async (request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    return await helper<StatusDto>(request, async (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null) => {
        return await statusService.loadMoreStoryStatuses(token, userAlias, pageSize, lastItem);
    });
}
