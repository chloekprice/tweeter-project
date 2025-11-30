import { FollowsDao } from "./follows/FollowsDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { StatusesDao } from "./statuses/StatusesDao";
import { UsersDao } from "./users/UsersDao";

export interface DatabaseFactory {
    createFollowsDao(): FollowsDao
    createSessionsDao(): SessionsDao
    createStatusesDao(): StatusesDao
    createUsersDao(): UsersDao
}
