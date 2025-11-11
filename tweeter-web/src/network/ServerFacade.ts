import {
    FollowerStatusRequest,
  FollowerStatusResponse,
  GetUserResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  TweeterRequest,
  UpdateFollowStatusResponse,
  User,
  UserDto,
  UserItemCountResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL = "https://qmwa3mswx8.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getFollowStatus(request: FollowerStatusRequest): Promise<boolean> {
        const endpoint = "/user/follow-status"
        const response = await this.clientCommunicator.doPost<FollowerStatusRequest, FollowerStatusResponse>(request, endpoint);

        const isFollowing: boolean | null = response.success && typeof response.isFollowing === "boolean" ? response.isFollowing : null;
  
        if (response.success) {
            if (isFollowing == null) { throw new Error(`No follow status for ${request.selectedUserAlias} found`); } 
            else { return isFollowing; }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

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

    public async getUser(request: TweeterRequest): Promise<User> {
        const endpoint = "/user";
        const response = await this.clientCommunicator.doPost<TweeterRequest, GetUserResponse>(request, endpoint);

        const user: User | null = response.success && response.user ? User.fromDto(response.user) : null;
  
        if (response.success) {
            if (user == null) { throw new Error(`No user with alias ${request.userAlias} found`); } 
            else { return user; }
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

    public async updateFollowStatus(request: TweeterRequest, status: string): Promise<[number, number]> {
        const endpoint = "/user/" + status;
        const response = await this.clientCommunicator.doPost<TweeterRequest, UpdateFollowStatusResponse>(request, endpoint);

        const followerCount: number | null = response.success && response.followerCount ? response.followerCount : null;
        const followeeCount: number | null = response.success && response.followeeCount ? response.followeeCount : null;
  
        if (response.success) {
            if (followerCount == null || followeeCount == null) { throw new Error(`No ${request.userAlias} or its following counts found`); } 
            else { return [followerCount, followeeCount]; }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

}
