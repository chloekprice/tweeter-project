import { AuthToken, PagedItemRequest, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";


class StatusService implements Service {
    private server: ServerFacade = new ServerFacade();

    public async loadMoreFeedStatuses (authToken: AuthToken, userAlias: string, pageSize: number, lastStatus: Status | null): Promise<[Status[], boolean]>  {
        return this.server.getMoreItems<StatusDto, Status>(this.createRequest(authToken, userAlias, pageSize, lastStatus), Status, "/status/feed");
    };
    
    public async loadMoreStoryStatuses (authToken: AuthToken, userAlias: string, pageSize: number, lastStatus: Status | null): Promise<[Status[], boolean]> {
        return this.server.getMoreItems<StatusDto, Status>(this.createRequest(authToken, userAlias, pageSize, lastStatus), Status, "/status/story");
    };

    private createRequest(authToken: AuthToken, userAlias: string, pageSize: number, lastStatus: Status | null): PagedItemRequest<StatusDto> {
        return {
            token: authToken.token, 
            userAlias: userAlias, 
            pageSize: pageSize, 
            lastItem: lastStatus ? lastStatus.dto : null
        }
    }
}

export default StatusService;
