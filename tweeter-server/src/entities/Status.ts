import { Segment } from "./Segment";

export class Status {
    userAlias: string; // PK
    timestamp: number; // SK
    post: string;
    segments: Segment[];

    public constructor(
        user_alias: string,
        timestamep: number,
        post: string,
        segments: Segment[]
    ) {
        this.userAlias = user_alias;
        this.timestamp = timestamep;
        this.post = post;
        this.segments = segments;
    }
}