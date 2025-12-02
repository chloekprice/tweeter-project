import { DatabaseFactory } from "../daos/DatabaseFactory";
import { FollowsDao } from "../daos/follows/FollowsDao";
import { ImagesDao } from "../daos/images/ImagesDao";
import { SessionsDao } from "../daos/sessions/SessionsDao";
import { StatusesDao } from "../daos/statuses/StatusesDao";
import { UsersDao } from "../daos/users/UsersDao";

export class Service {
    protected static imagesProvider: ImagesDao;
    protected static followsProvider: FollowsDao
    protected static sessionProvider: SessionsDao;
    protected static statusesProvider: StatusesDao;
    protected static usersProvider: UsersDao;
    
    constructor(daoProvider: DatabaseFactory) {
        Service.imagesProvider = daoProvider.createImagesDao();
        Service.followsProvider = daoProvider.createFollowsDao();
        Service.sessionProvider = daoProvider.createSessionsDao();
        Service.statusesProvider = daoProvider.createStatusesDao();
        Service.usersProvider = daoProvider.createUsersDao();
    }


    protected async checkAuthorization(token: string): Promise<boolean> {
        const result = await Service.sessionProvider.getSession(token);

        if (typeof result ==="undefined") {
            throw new Error("Unauthenticated: You cannot access the resource at this time");
        }

        if (result.lastActivityTimestamp < (Date.now() + result.ttl)) {
            await Service.sessionProvider.updateSessionActivity(token);
            return true;
        }

        await Service.sessionProvider.deleteSession(token, null);
        return false;
    }

 }
