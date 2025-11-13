import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { helper } from "../../utils/GetItemsHelper"
import StatusService from "../../services/StatusService";

export const handler = async (request: PagedItemRequest<StatusDto>): Promise<PagedItemResponse<StatusDto>> => {
    return await helper<StatusDto>(request, async (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null) => {
        const statusService = new StatusService();
        return await statusService.loadMoreStoryStatuses(token, userAlias, pageSize, lastItem);
    });
}
