import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";

export const helper = async (request: PagedUserItemRequest, 
    loadFunction: (token: string, userAlias: string, pageSize: number, lastItem: UserDto | null) => Promise<[any, any]>
): Promise<PagedUserItemResponse> => {
    if (!request.token || !request.userAlias || !request.pageSize) {
        throw new Error("Bad Request: the request does not include all required parameters");
    }
    if (typeof request.token !== "string") {
        throw new Error("Unauthorized: there are insufficient permissions to perform this action")
    }

    const [items, hasMore] = await loadFunction(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null, 
        items: items,
        hasMore: hasMore
    }
}
