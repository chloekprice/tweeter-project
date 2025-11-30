import { StatusDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { StatusesDao } from "../daos/statuses/StatusesDao";
import { SessionsDao } from "../daos/sessions/SessionsDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { DataPage } from "../entities/DataPage";
import { UsersDao } from "../daos/users/UsersDao";
import { User } from "../entities/User";
import { Status } from "../entities/Status";


class StatusService implements Service {
    private sessionProvider: SessionsDao;
    private statusesProvider: StatusesDao;
    private usersProvider: UsersDao;
    
    constructor(daoProvider: DatabaseFactory) {
        this.sessionProvider = daoProvider.createSessionsDao();
        this.statusesProvider = daoProvider.createStatusesDao();
        this.usersProvider = daoProvider.createUsersDao();
    }


    public async loadMoreFeedStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>  {
        // TO-DO: update for feed
        // TO-DO: check authorization
        const user = await this.usersProvider.getUser(userAlias);
        if (user == null) {
            throw new Error(`Bad Request: the selected user ${userAlias} does not exist`);
        }

        const lastStatus = lastItem == null ? 
            undefined : {
                userAlias: lastItem!.user.alias, 
                timestamp: lastItem!.timestamp, 
                post: lastItem!.post, 
                segments: lastItem!.segments.map(seg => ({
                text: seg.text,
                startPosition: seg.startPostion,
                endPosition: seg.endPosition,
                type: seg.type
            }))
            }
        const page = await this.statusesProvider.getPageOfStatuses(userAlias, pageSize, lastStatus);
        return [this.getStatusDtosFromPage(page, user), page.hasMorePages];
    };
    
    public async loadMoreStoryStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
        // TO-DO: check authorization
        const user = await this.usersProvider.getUser(userAlias);
        if (user == null) {
            throw new Error(`Bad Request: the selected user ${userAlias} does not exist`);
        }
        
        const lastStatus = lastItem == null ? 
            undefined : {
                userAlias: lastItem!.user.alias, 
                timestamp: lastItem!.timestamp, 
                post: lastItem!.post, 
                segments: lastItem!.segments.map(seg => ({
                text: seg.text,
                startPosition: seg.startPostion,
                endPosition: seg.endPosition,
                type: seg.type
            }))
        }
        
        const page = await this.statusesProvider.getPageOfStatuses(userAlias, pageSize, lastStatus);
        return [this.getStatusDtosFromPage(page, user), page.hasMorePages]
    };


    private getStatusDtosFromPage(page: DataPage<Status>, user: User): StatusDto[] {
        const userDto: UserDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl
        }

        const statuses: StatusDto[] = page.values.map((value) => ({
            post: value.post, 
            user: userDto,
            timestamp: value.timestamp,
            segments: value.segments.map(seg => ({
                text: seg.text,
                startPostion: seg.startPosition,
                endPosition: seg.endPosition,
                type: seg.type
            }))
        }));

        return statuses;
    }
}

export default StatusService;
