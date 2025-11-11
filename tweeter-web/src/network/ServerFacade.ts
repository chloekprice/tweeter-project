import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  TweeterRequest,
  User,
  UserItemCountResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL = "https://qmwa3mswx8.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getMoreUserItems(request: PagedUserItemRequest, itemType: string): Promise<[User[], boolean]> {
        const endpoint = "/" + itemType + "/list/load";
        const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(request, endpoint);

        const items: User[] | null =
        response.success && response.items
            ? response.items.map((dto) => User.fromDto(dto) as User)
            : null;
  
        if (response.success) {
            if (items == null) { throw new Error(`No ${itemType}s found`); } 
            else { return [items, response.hasMore]; }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getUserItemCount(request: TweeterRequest, itemType: string): Promise<number> {
        const endpoint = "/" + itemType + "/list/count";
        const response = await this.clientCommunicator.doPost<TweeterRequest, UserItemCountResponse>(request, endpoint);

        const count: number | null = response.success && response.count ? response.count : null;
  
        if (response.success) {
            if (count == null) { throw new Error(`No ${itemType} count found`); } 
            else { return count; }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

}
