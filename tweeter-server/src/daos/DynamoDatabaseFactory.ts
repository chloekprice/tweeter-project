import { DatabaseFactory } from "./DatabaseFactory";
import { DynamoFollowsDao } from "./follows/DynamoFollowsDao";
import { FollowsDao } from "./follows/FollowsDao";


export class DynamoDatabaseFactory implements DatabaseFactory {
    
    createFollowsDao(): FollowsDao {
        return new DynamoFollowsDao();
    }

}
