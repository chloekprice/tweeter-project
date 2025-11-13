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

        const response = await this.callBackend<FollowerStatusRequest, FollowerStatusResponse>(request, endpoint);

        const isFollowing: boolean | null = typeof response.isFollowing === "boolean" ? response.isFollowing : null;
        if (isFollowing == null) { throw new Error(`No follow status for ${request.selectedUserAlias} found`); } 
        else { return isFollowing; }
    }

    public async getMoreItems<T extends UserDto | StatusDto, V extends User | Status>(
        request: PagedItemRequest<T>, 
        modelClass: FromDto<V>, 
        endpoint: string
    ): Promise<[V[], boolean]> {

        const response = await this.callBackend<PagedItemRequest<T>, PagedItemResponse<T>>(request, endpoint);
        
        const items: V[] | null =
        response.items
            ? response.items.map((dto) => modelClass.fromDto(dto) as V)
            : null;
        if (items == null) { throw new Error(`No item found`); } 
        else { return [items, response.hasMore]; }
    }

    public async getUser(request: TweeterRequest): Promise<User> {
        const endpoint = "/user";

        const response = await this.callBackend<TweeterRequest, GetUserResponse>(request, endpoint);
        
        const user: User | null =  response.user ? User.fromDto(response.user) : null;
        if (user == null) { throw new Error(`No user with alias ${request.userAlias} found`); } 
        else { return user; }
    }

    public async getUserItemCount(request: TweeterRequest, itemType: string): Promise<number> {
        const endpoint = "/" + itemType + "/list/count";

        const response = await this.callBackend<TweeterRequest, UserItemCountResponse>(request, endpoint);
        
        const count: number | null = response.count ? response.count : null;
        if (count == null) { throw new Error(`No ${itemType} count found`); } 
        else { return count; }
    }

    public async loginUser(request: AuthenticationRequest): Promise<[User, AuthToken]> {
        const endpoint = "/auth/login"
        return this.doAuthResponseAction<AuthenticationRequest>(request, endpoint);
    }

    public async logoutUser(request: TweeterRequest): Promise<void> {
        const endpoint = "/auth/logout"
        await this.callBackend<TweeterRequest, TweeterResponse>(request, endpoint);
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        const endpoint = "/status/post";
        await this.callBackend<PostStatusRequest, TweeterResponse>(request, endpoint);
    }

    public async registerUser(request: RegisterRequest): Promise<[User, AuthToken]> {
        const endpoint = "/auth/register"
        return this.doAuthResponseAction<RegisterRequest>(request, endpoint);
    }

    public async updateFollowStatus(request: TweeterRequest, status: string): Promise<[number, number]> {
        const endpoint = "/user/" + status;

        const response = await this.callBackend<TweeterRequest, UpdateFollowStatusResponse>(request, endpoint);
        
        const followerCount: number | null = response.followerCount ? response.followerCount : null;
        const followeeCount: number | null = response.followeeCount ? response.followeeCount : null;
        if (followerCount == null || followeeCount == null) { throw new Error(`No ${request.userAlias} or its following counts found`); } 
        else { return [followerCount, followeeCount]; }
    }



    private async callBackend<V extends TweeterRequest | AuthenticationRequest, W extends TweeterResponse | AuthenticationResponse>(request: V, endpoint: string): Promise<W> {
        const response = await this.clientCommunicator.doPost<V, W>(request, endpoint);
        this.handleResponseError(response);
        return response;
    }

    private async doAuthResponseAction<T extends AuthenticationRequest>(request: T, endpoint: string): Promise<[User, AuthToken]> {
        const response = await this.callBackend<T, AuthenticationResponse>(request, endpoint);

        const user: User | null = response.user ? User.fromDto(response.user) : null;
        const authToken: AuthToken | null = response.authToken ? AuthToken.fromDto(response.authToken) : null;
   
        if (user == null) { throw new Error(`No user returned for ${request.alias} found`); } 
        else if (authToken == null) { throw new Error(`No auth token returned for ${request.alias} found`); }
        else { return [user, authToken]; }
    }

    private handleResponseError<W extends TweeterResponse | AuthenticationResponse>(response: W): void {
        if (!response.success) {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

}
