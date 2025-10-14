import { AuthToken, User } from "tweeter-shared";
import UserItemPresenter from "./UserItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

class FolloweePresenter extends UserItemPresenter {
    
    protected getItemDescription(): string {
        return "load followees";
    }

    protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return await this.service.loadMoreFollowees(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}

export default FolloweePresenter;
