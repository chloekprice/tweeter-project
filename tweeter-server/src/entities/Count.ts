
export class Count {
    userAlias: string; // PK
    followeeCount: number;
    followerCount: number;

    public constructor(userAlias: string, followeeCount: number, followerCount: number) {
        this.userAlias = userAlias;
        this.followeeCount = followeeCount;
        this.followerCount = followerCount;
    }
}
