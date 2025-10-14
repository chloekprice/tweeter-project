import { AuthToken } from "tweeter-shared";
import FollowService from "../../models/FollowService";
import UserItemPresenter, { UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;


class FollowerPresenter extends UserItemPresenter {
    private service: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.service = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        await this.performThrowingFunction( async () => {
            const [newItems, hasMore] = await this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, "load followers")
    };
}

export default FollowerPresenter;
