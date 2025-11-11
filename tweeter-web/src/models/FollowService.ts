import { AuthToken, User, FakeData, PagedUserItemRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";


class FollowService implements Service {
    private server: ServerFacade = new ServerFacade();

    public async loadMoreFollowees (authToken: AuthToken, userAlias: string, pageSize: number, lastFollowee: User | null): Promise<[User[], boolean]>  {
        
        return this.server.getMoreFollowees(this.createRequest(authToken, userAlias, pageSize, lastFollowee));
    };

    public async loadMoreFollowers (authToken: AuthToken, userAlias: string, pageSize: number, lastFollower: User | null): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
    };

    private createRequest(authToken: AuthToken, userAlias: string, pageSize: number, lastFollowee: User | null): PagedUserItemRequest {
        return {
            token: authToken.token, 
            userAlias: userAlias, 
            pageSize: pageSize, 
            lastItem: lastFollowee ? lastFollowee.dto : null
        }
    }
}

export default FollowService;
