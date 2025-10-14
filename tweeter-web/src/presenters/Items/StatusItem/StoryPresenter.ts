import { AuthToken, Status, User } from "tweeter-shared";
import StatusItemPresenter from "./StatusItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

class StoryPresenter extends StatusItemPresenter {

    protected getItemDescription(): string {
        return "load story items";
    }

    protected async getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return await this.service.loadMoreStoryStatuses(authToken, userAlias, PAGE_SIZE, this.lastItem);
    }
}

export default StoryPresenter;
