import { StatusDto } from "tweeter-shared";
import { Status } from "../entities/Status";
import { Segment } from "../entities/Segment";
import { Service } from "./Service";
import { Feed } from "../entities/Feed";
import { User } from "../entities/User";

export interface FanoutMessage {
    postAuthor: User,
    postStatus: Status
}

export interface WorkerMessage {
    followerAlias: string,
    postAuthor: User,
    postStatus: Status
}

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
            
            // push message to process user post queue
            const payload: FanoutMessage = {
                postAuthor: {...currentUser!},
                postStatus: {...newPost},
            };
            const payloadMessage = JSON.stringify(payload);

            await Service.queueProvider.sendFanoutMessage(payloadMessage);
        });
    };

    public async postStatusToFeed(postPayload: string): Promise<void> {
        await this.performThrowingFunction( async () => {
            const postInfo = JSON.parse(postPayload) as WorkerMessage;

            let feedPost = new Feed(postInfo.followerAlias, postInfo.postAuthor, postInfo.postStatus.timestamp, postInfo.postStatus);
            await Service.feedsProvider.addToFeed({...feedPost});
        })
    }

    public async sendPostToFollowers(postPayload: string): Promise<void> {
        await this.performThrowingFunction(async () => {
            const postInfo = JSON.parse(postPayload) as FanoutMessage;

            const followers = await Service.followsProvider.getFollowers(postInfo.postAuthor.alias);

            followers.forEach( async(follower) => {
                // push message to update feed
                const payload: WorkerMessage = {
                    followerAlias: follower,
                    postAuthor: postInfo.postAuthor,
                    postStatus: postInfo.postStatus,
                };
                const payloadMessage = JSON.stringify(payload);

                await Service.queueProvider.sendWorkerMessage(payloadMessage);
            });
        })
    }
}

export default PostService;
