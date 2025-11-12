import { AuthToken, User, PagedItemRequest, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";


class FollowService implements Service {
    private server: ServerFacade = new ServerFacade();

    public async loadMoreFollowees (authToken: AuthToken, userAlias: string, pageSize: number, lastFollowee: User | null): Promise<[User[], boolean]>  {
        return this.server.getMoreUserItems(this.createRequest(authToken, userAlias, pageSize, lastFollowee), "followee");
    };

    public async loadMoreFollowers (authToken: AuthToken, userAlias: string, pageSize: number, lastFollower: User | null): Promise<[User[], boolean]> {
        return this.server.getMoreUserItems(this.createRequest(authToken, userAlias, pageSize, lastFollower), "follower");
    };

    private createRequest(authToken: AuthToken, userAlias: string, pageSize: number, lastFollowee: User | null): PagedItemRequest<UserDto> {
        return {
            token: authToken.token, 
            userAlias: userAlias, 
            pageSize: pageSize, 
            lastItem: lastFollowee ? lastFollowee.dto : null
        }
    }
}

export default FollowService;
