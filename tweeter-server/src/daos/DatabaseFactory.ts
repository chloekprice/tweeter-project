import { FollowsDao } from "./follows/FollowsDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { UsersDao } from "./users/UsersDao";

export interface DatabaseFactory {
    createFollowsDao(): FollowsDao
    createSessionsDao(): SessionsDao
    createUsersDao(): UsersDao
}
