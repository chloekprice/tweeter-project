import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";


class UserService implements Service {

    
    public async follow(token: string, userToFollow: string): Promise<[followerCount: number, followeeCount: number]>  {
       // TODO: follow the user
        return this.updateFollowingCounts(token, userToFollow);
    };

    public async getFolloweeCount (token: string, userAlias: string): Promise<number> {
        return FakeData.instance.getFolloweeCount(userAlias);
    };

    public async getFollowerCount (token: string, userAlias: string): Promise<number> {
        return FakeData.instance.getFollowerCount(userAlias);
    };

    public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null>  {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    public async unfollow(token: string, userToUnfollow: string): Promise<[followerCount: number, followeeCount: number]> {
        // TODO: unfollow the user
        return this.updateFollowingCounts(token, userToUnfollow);
    };


    private async updateFollowingCounts(token: string, userToUpdate: string): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToUpdate);
        const followeeCount = await this.getFolloweeCount(token, userToUpdate);

        return [followerCount, followeeCount];
    }
    
}

export default UserService;
