import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

class PostService {
    private serverFacade: ServerFacade = new ServerFacade();

    public async postStatus(authToken: AuthToken, user: User, newStatus: Status): Promise<void> {
        return this.serverFacade.postStatus({ token: authToken.token, userAlias: user.alias, status: newStatus});
    };
}

export default PostService;
