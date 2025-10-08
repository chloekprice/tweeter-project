import { AuthToken } from "tweeter-shared";
import StatusItemPresenter, { StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

class StoryPresenter extends StatusItemPresenter {

    public constructor(view: StatusItemView) {
        super(view);
    }

    public loadMoreItems(authToken: AuthToken, userAlias: string): void {
        
    }

}

export default StoryPresenter;
