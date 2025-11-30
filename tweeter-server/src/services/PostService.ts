import { StatusDto } from "tweeter-shared";
import { SessionsDao } from "../daos/sessions/SessionsDao";
import { StatusesDao } from "../daos/statuses/StatusesDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { Status } from "../entities/Status";
import { Segment } from "../entities/Segment";

class PostService {
    private sessionProvider: SessionsDao;
    private statusesProvider: StatusesDao;
    
    constructor(daoProvider: DatabaseFactory) {
        this.sessionProvider = daoProvider.createSessionsDao();
        this.statusesProvider = daoProvider.createStatusesDao();
    }

    public async postStatus(token: string, userAlias: string, newStatus: StatusDto): Promise<void> {
        // TO-DO: check authorization
        const segments: Segment[] = (newStatus.segments ?? []).map(seg => ({
            text: seg.text,
            startPosition: seg.startPostion,
            endPosition: seg.endPosition,
            type: seg.type
        }))

        const newPost: Status = new Status(userAlias, newStatus.timestamp?? Date.now(), newStatus.post, segments);
        await this.statusesProvider.addStatus(newPost);
    };
}

export default PostService;
