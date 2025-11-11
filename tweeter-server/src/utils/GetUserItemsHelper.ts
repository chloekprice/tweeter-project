import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";

export const helper = async (request: PagedUserItemRequest, loadFunction: () => Promise<[any, any]>): Promise<PagedUserItemResponse> => {
    if (!request.token || !request.userAlias || !request.pageSize) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

    const [items, hasMore] = await loadFunction();

    return {
        success: true,
        message: null, 
        items: items,
        hasMore: hasMore
    }
}
