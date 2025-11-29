import { FollowsDao } from "./follows/FollowsDao";
import { UsersDao } from "./users/UsersDao";

export interface DatabaseFactory {
    createFollowsDao(): FollowsDao
}
