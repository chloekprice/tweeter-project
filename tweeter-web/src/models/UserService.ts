import { AuthToken, User, FakeData, TweeterRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";


class UserService implements Service {
    private server: ServerFacade = new ServerFacade();

    
    public async follow(authToken: AuthToken, userToFollow: User): Promise<[followerCount: number, followeeCount: number]>  {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

        return [followerCount, followeeCount];
    };

    public async getFolloweeCount (authToken: AuthToken, user: User): Promise<number> {
        return this.server.getUserItemCount(this.createRequest(authToken, user), "followee");
    };

    public async getFollowerCount (authToken: AuthToken, user: User): Promise<number> {
        return this.server.getUserItemCount(this.createRequest(authToken, user), "follower");
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
    
        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
    
        return [followerCount, followeeCount];
    };

    private createRequest(authToken: AuthToken, user: User): TweeterRequest {
        return {
            token: authToken.token, 
            userAlias: user.alias
        }
    }
    
}

export default UserService;
