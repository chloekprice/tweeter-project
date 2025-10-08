import { AuthToken } from "tweeter-shared";
import StatusItemPresenter, { StatusItemView } from "./StatusItemPresenter";
import StatusService from "../../models/StatusService";

export const PAGE_SIZE = 10;

class FeedPresenter extends StatusItemPresenter {
    private service: StatusService

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
        try {
            const [newItems, hasMore] = await this.service.loadMoreFeedStatuses(authToken, userAlias, PAGE_SIZE, this.lastItem);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to load feed items because of exception: ${error}`);
        }
    }

}

export default FeedPresenter;
