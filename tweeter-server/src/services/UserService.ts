import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { FollowsDao } from "../daos/follows/FollowsDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { UsersDao } from "../daos/users/UsersDao";
import { Follow } from "../entities/Follow";


class UserService implements Service {
    private followsProvider: FollowsDao;
    private usersProvider: UsersDao;

    constructor(daoProvider: DatabaseFactory) {
        this.followsProvider = daoProvider.createFollowsDao();
        this.usersProvider = daoProvider.createUsersDao();
    }

    
    public async follow(token: string, userToFollow: string): Promise<[followerCount: number, followeeCount: number]>  {
        // TO-DO: check authentication
        // TO-DO: get user
       // TO-DO: follow the user
        return await this.updateFollowingCounts(token, userToFollow);
    };

    public async getFolloweeCount (token: string, userAlias: string): Promise<number> {
        // TO-DO: check authentication
        return await this.followsProvider.getFolloweeCount(userAlias);
    };

    public async getFollowerCount (token: string, userAlias: string): Promise<number> {
        // TO-DO: check authentication
        return await this.followsProvider.getFollowerCount(userAlias);
    };

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        // TO-DO: check authentication
        const followCheck: Follow = new Follow(selectedUserAlias, "", "", "", userAlias, "", "", "");
        const result: Follow | undefined = await this.followsProvider.getFollow(followCheck);
        return typeof result === "undefined" ? false : true
    };

    public async getUser (token: string, alias: string): Promise<UserDto | null>  {
        // TO-DO: check authentication
        return await this.usersProvider.getUser(alias);
    };

    public async unfollow(token: string, userToUnfollow: string): Promise<[followerCount: number, followeeCount: number]> {
        // TO-DO: check authentication
        // TO-DO: get user
        // TO-DO: unfollow the user
        return await this.updateFollowingCounts(token, userToUnfollow);
    };


    private async updateFollowingCounts(token: string, userToUpdate: string): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToUpdate);
        const followeeCount = await this.getFolloweeCount(token, userToUpdate);

        return [followerCount, followeeCount];
    }
    
}

export default UserService;
