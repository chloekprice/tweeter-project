import { FollowsDao } from "./follows/FollowsDao";

export interface DatabaseFactory {
    createFollowsDao(): FollowsDao
}
