import { AuthToken, Status } from "tweeter-shared";
import StatusItemPresenter from "./StatusItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

class FeedPresenter extends StatusItemPresenter {
    
    protected getItemDescription(): string {
        return "load feed items";
    }

    protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return await this.service.loadMoreFeedStatuses(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}

export default FeedPresenter;
