
export class Follow {
    followeeHandle: string;
    followeeFirstName: string;
    followeeLastName: string;
    followeeImageUrl: string;
    followerHandle: string;
    followerFirstName: string;
    followerLastName: string;
    followerImageUrl: string;

    public constructor(
        followeeHandle: string, 
        followeeFirstName: string, 
        followeeLastName: string,
        followeeImageUrl: string,
        followerHandler: string, 
        followerFirstName: string,
        followerLastName: string,
        followerImageUrl: string
    ) {
        this.followeeHandle = followeeHandle;
        this.followeeFirstName = followeeFirstName;
        this.followeeLastName = followeeLastName;
        this.followeeImageUrl = followeeImageUrl;
        this.followerHandle = followerHandler;
        this.followerFirstName = followerFirstName;
        this.followerLastName = followerLastName;
        this.followerImageUrl = followerImageUrl;
    }
}