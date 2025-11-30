import { DatabaseFactory } from "./DatabaseFactory";
import { DynamoFollowsDao } from "./follows/DynamoFollowsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { DynamoSessionsDao } from "./sessions/DynamoSessionsDao";
import { SessionsDao } from "./sessions/SessionsDao";


export class DynamoDatabaseFactory implements DatabaseFactory {
    
    createFollowsDao(): FollowsDao {
        return new DynamoFollowsDao();
    }

    createSessionsDao(): SessionsDao {
        return new DynamoSessionsDao();
    }

}
