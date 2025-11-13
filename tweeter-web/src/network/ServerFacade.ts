import {
    AuthenticationRequest,
    AuthenticationResponse,
    AuthToken,
    FollowerStatusRequest,
    FollowerStatusResponse,
    GetUserResponse,
    PagedItemRequest,
    PagedItemResponse,
    PostStatusRequest,
    RegisterRequest,
    Status,
    StatusDto,
    TweeterRequest,
    TweeterResponse,
    UpdateFollowStatusResponse,
    User,
    UserDto,
    UserItemCountResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

interface FromDto<T> {
    fromDto(dto: unknown): T | null;
}

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

    public async getMoreItems<T extends UserDto | StatusDto, V extends User | Status>(
        request: PagedItemRequest<T>, 
        modelClass: FromDto<V>, 
        endpoint: string
    ): Promise<[V[], boolean]> {

        const response = await this.clientCommunicator.doPost<PagedItemRequest<T>, PagedItemResponse<T>>(request, endpoint);

        const items: V[] | null =
        response.success && response.items
            ? response.items.map((dto) => modelClass.fromDto(dto) as V)
            : null;
  
        if (response.success) {
            if (items == null) { throw new Error(`No item found`); } 
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

    public async loginUser(request: AuthenticationRequest): Promise<[User, AuthToken]> {
        const endpoint = "/auth/login"
        const response = await this.clientCommunicator.doPost<AuthenticationRequest, AuthenticationResponse>(request, endpoint);

        const user: User | null = response.success && response.user ? User.fromDto(response.user) : null;
        const authToken: AuthToken | null = response.success && response.authToken ? AuthToken.fromDto(response.authToken) : null;
  
        if (response.success) {
            if (user == null) { throw new Error(`No user returned for ${request.alias} found`); } 
            else if (authToken == null) { throw new Error(`No auth token returned for ${request.alias} found`); }
            else { return [user, authToken]; }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async logoutUser(request: TweeterRequest): Promise<void> {
        const endpoint = "/auth/logout"
        const response = await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(request, endpoint);
  
        if (response.success) {
            return;
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        const endpoint = "/status/post";
        const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
  
        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async registerUser(request: RegisterRequest): Promise<[User, AuthToken]> {
        const endpoint = "/auth/register"
        const response = await this.clientCommunicator.doPost<RegisterRequest, AuthenticationResponse>(request, endpoint);

        const user: User | null = response.success && response.user ? User.fromDto(response.user) : null;
        const authToken: AuthToken | null = response.success && response.authToken ? AuthToken.fromDto(response.authToken) : null;
  
        if (response.success) {
            if (user == null) { throw new Error(`No user returned for ${request.alias} found`); } 
            else if (authToken == null) { throw new Error(`No auth token returned for ${request.alias} found`); }
            else { return [user, authToken]; }
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
