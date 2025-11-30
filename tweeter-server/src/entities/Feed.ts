import { Status } from "./Status";

export class Feed {
    userAlias: string; // PK
    timestamp: number; // SK
    statuses: Status[]; 

    public constructor (
        user_alias: string,
        timestamp: number,
        statuses: Status[]
    ) {
        this.userAlias = user_alias;
        this.timestamp = timestamp;
        this.statuses = statuses;
    }
}
