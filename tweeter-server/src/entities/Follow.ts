
export class Follow {
    followeeHandle: string;
    followerHandle: string;
    followeeName: string;
    followerName: string;

    public constructor(followeeHandle: string, followerHandler: string, followeeName: string, followerName: string) {
        this.followeeHandle = followeeHandle;
        this.followerHandle = followerHandler;
        this.followeeName = followeeName;
        this.followerName = followerName;
    }
}