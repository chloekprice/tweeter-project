import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DatabaseFactory } from "./DatabaseFactory";
import { DynamoFeedsDao } from "./feeds/DynamoFeedsDao";
import { FeedsDao } from "./feeds/FeedsDao";
import { DynamoFollowsDao } from "./follows/DynamoFollowsDao";
import { FollowsDao } from "./follows/FollowsDao";
import { ImagesDao } from "./images/ImagesDao";
import { S3ImagesDao } from "./images/S3ImagesDao";
import { DynamoSessionsDao } from "./sessions/DynamoSessionsDao";
import { SessionsDao } from "./sessions/SessionsDao";
import { DynamoStatusesDao } from "./statuses/DynamoStatusesDao";
import { StatusesDao } from "./statuses/StatusesDao";
import { DynamoUsersDao } from "./users/DynamoUsersDao";
import { UsersDao } from "./users/UsersDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { CountsDao } from "./counts/CountsDao";
import { DynamoCountsDao } from "./counts/DynamoCountsDao";


export class AmazonDatabaseFactory implements DatabaseFactory {
    readonly region = "us-east-1"
    private readonly dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly s3Client = new S3Client({ region: this.region });

    createCountsDao(): CountsDao {
        return new DynamoCountsDao(this.dynamoClient);
    }

    createFeedsDao(): FeedsDao {
        return new DynamoFeedsDao(this.dynamoClient);
    }
    
    createFollowsDao(): FollowsDao {
        return new DynamoFollowsDao(this.dynamoClient);
    }

    createImagesDao(): ImagesDao {
        return new S3ImagesDao(this.s3Client);
    }

    createSessionsDao(): SessionsDao {
        return new DynamoSessionsDao(this.dynamoClient);
    }

    createStatusesDao(): StatusesDao {
        return new DynamoStatusesDao(this.dynamoClient);
    }

    createUsersDao(): UsersDao {
        return new DynamoUsersDao(this.dynamoClient);
    }
}
