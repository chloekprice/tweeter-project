import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

class PostService {
    private serverFacade: ServerFacade = new ServerFacade();

    public async postStatus(authToken: AuthToken, user: User, newStatus: Status): Promise<void> {
        return await this.serverFacade.postStatus({ 
            token: authToken.token, 
            userAlias: user.alias, 
            status: {
                post: newStatus.post, 
                user: {
                    firstName: newStatus.user.firstName,
                    lastName: newStatus.user.lastName,
                    alias: newStatus.user.alias,
                    imageUrl: newStatus.user.imageUrl
                },
                timestamp: newStatus.timestamp,
                segments: (newStatus.segments ?? []).map(seg => ({
                    text: seg.text,
                    startPostion: seg.startPostion,
                    endPosition: seg.endPosition,
                    type: seg.type.toString()
                }))
            }
        });
    };
}

export default PostService;
