
export class Session {
    token: string; // PK
    alias: string; // SK
    lastActivityTimestamp: number;
    ttl: number;

    public constructor(
        token: string,
        alias: string,
        lastActivityTimestamp: number,
        ttl: number
    ) {
        this.token = token;
        this.alias = alias;
        this.lastActivityTimestamp = lastActivityTimestamp;
        this.ttl = ttl;
    }
        
}
