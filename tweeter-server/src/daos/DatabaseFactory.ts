import { CountsDao } from "./counts/CountsDao";
import { FeedsDao } from "./feeds/FeedsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { ImagesDao } from "./images/ImagesDao";
import { QueueDao } from "./messaging/QueueDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { StatusesDao } from "./statuses/StatusesDao";
import { UsersDao } from "./users/UsersDao";

export interface DatabaseFactory {
    createCountsDao(): CountsDao
    createFeedsDao(): FeedsDao
    createFollowsDao(): FollowsDao
    createImagesDao(): ImagesDao
    createMessagingQueue(): QueueDao
    createSessionsDao(): SessionsDao
    createStatusesDao(): StatusesDao
    createUsersDao(): UsersDao
}
