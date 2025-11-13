import { AuthToken, User, FakeData, TweeterRequest, FollowerStatusRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";


class UserService implements Service {
    private server: ServerFacade = new ServerFacade();

    
    public async follow(authToken: AuthToken, userToFollow: User): Promise<[followerCount: number, followeeCount: number]>  {
        return await this.server.updateFollowStatus(this.createTweeterRequest(authToken, userToFollow), "follow")
    };

    public async getFolloweeCount (authToken: AuthToken, user: User): Promise<number> {
        return await this.server.getUserItemCount(this.createTweeterRequest(authToken, user), "followee");
    };

    public async getFollowerCount (authToken: AuthToken, user: User): Promise<number> {
        return await this.server.getUserItemCount(this.createTweeterRequest(authToken, user), "follower");
    };

    public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
        return await this.server.getFollowStatus(this.createFollowStatusRequest(authToken, user, selectedUser));
    };

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null>  {
        return await this.server.getUser({token: authToken.token, userAlias: alias});
    };

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followerCount: number, followeeCount: number]> {
        return await this.server.updateFollowStatus(this.createTweeterRequest(authToken, userToUnfollow), "unfollow");
    };


    private createFollowStatusRequest(authToken: AuthToken, user: User, selectedUser: User): FollowerStatusRequest {
        return {
            token: authToken.token, 
            userAlias: user.alias,
            selectedUserAlias: selectedUser.alias
        }
    }

    private createTweeterRequest(authToken: AuthToken, user: User): TweeterRequest {
        return {
            token: authToken.token, 
            userAlias: user.alias
        }
    }
    
}

export default UserService;
