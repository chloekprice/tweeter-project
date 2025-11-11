import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
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

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        return FakeData.instance.isFollower();
    };

    public async getUser (token: string, alias: string): Promise<UserDto | null>  {
        return FakeData.instance.findUserByAlias(alias)? FakeData.instance.findUserByAlias(alias)!.dto : null;
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
