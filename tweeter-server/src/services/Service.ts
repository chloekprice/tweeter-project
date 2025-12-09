import { CountsDao } from "../daos/counts/CountsDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { FeedsDao } from "../daos/feeds/FeedsDao";
import { FollowsDao } from "../daos/follows/FollowsDao";
import { ImagesDao } from "../daos/images/ImagesDao";
import { QueueDao } from "../daos/messaging/QueueDao";
import { SessionsDao } from "../daos/sessions/SessionsDao";
import { StatusesDao } from "../daos/statuses/StatusesDao";
import { UsersDao } from "../daos/users/UsersDao";

export class Service {
    protected static countsProvider: CountsDao;
    protected static feedsProvider: FeedsDao;
    protected static followsProvider: FollowsDao
    protected static imagesProvider: ImagesDao;
    protected static queueProvider: QueueDao;
    protected static sessionProvider: SessionsDao;
    protected static statusesProvider: StatusesDao;
    protected static usersProvider: UsersDao;
    
    constructor(daoProvider: DatabaseFactory) {
        Service.countsProvider = daoProvider.createCountsDao();
        Service.feedsProvider = daoProvider.createFeedsDao();
        Service.followsProvider = daoProvider.createFollowsDao();
        Service.imagesProvider = daoProvider.createImagesDao();
        Service.queueProvider = daoProvider.createMessagingQueue();
        Service.sessionProvider = daoProvider.createSessionsDao();
        Service.statusesProvider = daoProvider.createStatusesDao();
        Service.usersProvider = daoProvider.createUsersDao();
    }


    protected async checkAuthorization(token: string): Promise<boolean> {
        return await this.performThrowingFunction<boolean>(async () => {
            const result = await Service.sessionProvider.getSession(token);

            if (typeof result ==="undefined") {
                throw new Error("You cannot access the session resource at this time");
            }

            if ((result.lastActivityTimestamp + result.ttl) >= Date.now()) {
                await Service.sessionProvider.updateSessionActivity(token);
                return true;
            }

            await Service.sessionProvider.deleteSession(token, null);
            return false;
        });
    }

    protected async performAuthorizedThrowingFunction<T>(token: string, operation: () => Promise<T>): Promise<T> {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized- Your session has expired.")
        }

        return await this.performThrowingFunction<T>(operation);
    }

    protected async performThrowingFunction<T>(operation: () => Promise<T>): Promise<T> {
        try {
            return await operation();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Operation failed-", error);
            throw new Error(`Internal Server Error- ${message}`);
        }
    }

 }
