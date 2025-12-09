import { StatusDto } from "tweeter-shared";
import { Status } from "../entities/Status";
import { Segment } from "../entities/Segment";
import { Service } from "./Service";
import { Feed } from "../entities/Feed";

class PostService extends Service {

    public async postStatus(token: string, userAlias: string, newStatus: StatusDto): Promise<void> {
        return await this.performAuthorizedThrowingFunction<void>(token, async() => {
            const segments: Segment[] = (newStatus.segments ?? []).map(seg => ({
                text: seg.text,
                startPosition: seg.startPostion,
                endPosition: seg.endPosition,
                type: seg.type
            }))

            const newPost: Status = new Status(userAlias, newStatus.timestamp?? Date.now(), newStatus.post, segments);
            await Service.statusesProvider.addStatus({...newPost});

            const currentUser = await Service.usersProvider.getUser(userAlias);
            const followers = await Service.followsProvider.getFollowers(userAlias);

            followers.forEach( async(follower) => {
                let feedPost = new Feed(follower, {...currentUser!}, newPost.timestamp, {...newPost});
                await Service.feedsProvider.addToFeed({...feedPost});
            });
        });
    };
}

export default PostService;
