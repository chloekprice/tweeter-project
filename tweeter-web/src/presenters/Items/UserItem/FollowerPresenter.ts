import { AuthToken, User } from "tweeter-shared";
import UserItemPresenter from "./UserItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";


class FollowerPresenter extends UserItemPresenter {
    
    protected getItemDescription(): string {
        return "load followers";
    }

    protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return await this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}

export default FollowerPresenter;
