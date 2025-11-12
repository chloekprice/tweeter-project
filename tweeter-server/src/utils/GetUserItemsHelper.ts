import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { checkAuthorizationHelper } from "./CheckAuthorizationHelper";
import { checkRequestHelper } from "./CheckRequestHelper";

export const helper = async (request: PagedItemRequest<UserDto>, 
    loadFunction: (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => Promise<[any, any]>
): Promise<PagedItemResponse<UserDto>> => {
    checkRequestHelper(request);
    if (!request.pageSize) { throw new Error("Bad Request: the request does not include all required parameters"); }
    checkAuthorizationHelper(request);

    const [items, hasMore] = await loadFunction(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null, 
        items: items,
        hasMore: hasMore
    }
}
