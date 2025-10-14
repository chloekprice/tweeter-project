import { AuthToken } from "tweeter-shared";
import StatusItemPresenter, { StatusItemView } from "./StatusItemPresenter";
import StatusService from "../../models/StatusService";

export const PAGE_SIZE = 10;

class StoryPresenter extends StatusItemPresenter {
    private service: StatusService;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
        await this.performThrowingFunction( async () => {
            const [newItems, hasMore] = await this.service.loadMoreStoryStatuses(authToken, userAlias, PAGE_SIZE, this.lastItem);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, "load story items") 
    }
}

export default StoryPresenter;
