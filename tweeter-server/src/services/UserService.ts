import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";


class UserService implements Service {

    
    public async follow(authToken: AuthToken, userToFollow: User): Promise<[followerCount: number, followeeCount: number]>  {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(authToken.token, userToFollow.alias);
        const followeeCount = await this.getFolloweeCount(authToken.token, userToFollow.alias);

        return [followerCount, followeeCount];
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

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(authToken.token, userToUnfollow.alias);
        const followeeCount = await this.getFolloweeCount(authToken.token, userToUnfollow.alias);
    
        return [followerCount, followeeCount];
    };
    
}

export default UserService;
