import { DatabaseFactory } from "./DatabaseFactory";
import { DynamoFollowsDao } from "./follows/DynamoFollowsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { DynamoSessionsDao } from "./sessions/DynamoSessionsDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { DynamoStatusesDao } from "./statuses/DynamoStatusesDao";
import { StatusesDao } from "./statuses/StatusesDao";
import { DynamoUsersDao } from "./users/DynamoUsersDao";
import { UsersDao } from "./users/UsersDao";


export class DynamoDatabaseFactory implements DatabaseFactory {
    
    createFollowsDao(): FollowsDao {
        return new DynamoFollowsDao();
    }

    createSessionsDao(): SessionsDao {
        return new DynamoSessionsDao();
    }

    createStatusesDao(): StatusesDao {
        return new DynamoStatusesDao();
    }

    createUsersDao(): UsersDao {
        return new DynamoUsersDao();
    }
}
