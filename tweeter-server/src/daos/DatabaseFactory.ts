import { FeedsDao } from "./feeds/FeedsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { ImagesDao } from "./images/ImagesDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { StatusesDao } from "./statuses/StatusesDao";
import { UsersDao } from "./users/UsersDao";

export interface DatabaseFactory {
    createFeedsDao(): FeedsDao
    createFollowsDao(): FollowsDao
    createImagesDao(): ImagesDao
    createSessionsDao(): SessionsDao
    createStatusesDao(): StatusesDao
    createUsersDao(): UsersDao
}
