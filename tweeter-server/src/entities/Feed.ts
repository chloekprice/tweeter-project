import { Status } from "./Status";
import { User } from "./User";

export class Feed {
    userAlias: string; // PK
    user: User;
    timestamp: number; // SK
    status: Status; 

    public constructor (
        user_alias: string,
        user: User,
        timestamp: number,
        status: Status
    ) {
        this.userAlias = user_alias;
        this.user = user;
        this.timestamp = timestamp;
        this.status = status;
    }
}
