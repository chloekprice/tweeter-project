import { FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";


class StatusService implements Service {

    public async loadMoreFeedStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>  {
        return this.getFakeData(lastItem, pageSize);
    };
    
    public async loadMoreStoryStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    };

     private async getFakeData(lastStatus: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
        const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastStatus), pageSize);
        const dtos = statuses.map((status) => status.dto);
        return [dtos, hasMore];
    }
}

export default StatusService;
