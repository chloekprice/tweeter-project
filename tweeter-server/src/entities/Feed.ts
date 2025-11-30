import { Status } from "./Status";

export class Feed {
    user_alias: string; // PK
    timestamp: number; // SK
    statuses: Status[]; 

    public constructor (
        user_alias: string,
        timestamp: number,
        statuses: Status[]
    ) {
        this.user_alias = user_alias;
        this.timestamp = timestamp;
        this.statuses = statuses;
    }
}
