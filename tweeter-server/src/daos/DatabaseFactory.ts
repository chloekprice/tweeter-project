import { FollowsDao } from "./follows/FollowsDao";
import { SessionsDao } from "./sessions/SessionsDao";

export interface DatabaseFactory {
    createFollowsDao(): FollowsDao
    createSessionsDao(): SessionsDao
}
