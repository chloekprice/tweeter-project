import { DatabaseFactory } from "./DatabaseFactory";
import { DynamoFollowsDao } from "./follows/DynamoFollowsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { DynamoUsersDao } from "./users/DynamoUsersDao";
import { UsersDao } from "./users/UsersDao";


export class DynamoDatabaseFactory implements DatabaseFactory {
    
    createFollowsDao(): FollowsDao {
        return new DynamoFollowsDao();
    }

    createUsersDao(): UsersDao {
        return new DynamoUsersDao();
    }

}
