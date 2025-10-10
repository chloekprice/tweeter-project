import { AuthToken, FakeData, Status } from "tweeter-shared";


class StatusService {

    public async loadMoreFeedStatuses (authToken: AuthToken, userAlias: string, pageSize: number, lastStatus: Status | null): Promise<[Status[], boolean]>  {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
    };
    
    public async loadMoreStoryStatuses (authToken: AuthToken, userAlias: string, pageSize: number, lastStatus: Status | null): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(lastStatus, pageSize);
    };
}

export default StatusService;
