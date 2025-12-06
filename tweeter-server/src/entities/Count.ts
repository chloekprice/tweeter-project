
export class Count {
    userAlias: string; // PK
    followerCount: number;
    followeeCount: number;

    public constructor(userAlias: string, followerCount: number, followeeCount: number) {
        this.userAlias = userAlias;
        this.followeeCount = followeeCount;
        this.followerCount = followerCount;
    }
}
