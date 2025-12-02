import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { FollowsDao } from "../daos/follows/FollowsDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { UsersDao } from "../daos/users/UsersDao";
import { Follow } from "../entities/Follow";
import { SessionsDao } from "../daos/sessions/SessionsDao";


class UserService implements Service {
    private followsProvider: FollowsDao;
    private sessionProvider: SessionsDao;
    private usersProvider: UsersDao;

    constructor(daoProvider: DatabaseFactory) {
        this.followsProvider = daoProvider.createFollowsDao();
        this.sessionProvider = daoProvider.createSessionsDao();
        this.usersProvider = daoProvider.createUsersDao();
    }

    
    public async follow(token: string, userToFollow: string): Promise<[followerCount: number, followeeCount: number]>  {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        const currentUserSession = await this.sessionProvider.getSession(token);
        const currentUser = await this.usersProvider.getUser(currentUserSession!.alias);
        const otherUser = await this.usersProvider.getUser(userToFollow);

        const newFollow: Follow = new Follow(
            otherUser!.alias, otherUser!.firstName, otherUser!.lastName, otherUser!.imageUrl, 
            currentUser!.alias, currentUser!.firstName, currentUser!.lastName, currentUser!.imageUrl
        );
        await this.followsProvider.addFollow(newFollow);

        return await this.updateFollowingCounts(token, userToFollow);
    };

    public async getFolloweeCount (token: string, userAlias: string): Promise<number> {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        return await this.followsProvider.getFolloweeCount(userAlias);
    };

    public async getFollowerCount (token: string, userAlias: string): Promise<number> {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        return await this.followsProvider.getFollowerCount(userAlias);
    };

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        const followCheck: Follow = new Follow(selectedUserAlias, "", "", "", userAlias, "", "", "");
        const result: Follow | undefined = await this.followsProvider.getFollow(followCheck);
        return typeof result === "undefined" ? false : true
    };

    public async getUser (token: string, alias: string): Promise<UserDto | null>  {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        return await this.usersProvider.getUser(alias);
    };

    public async unfollow(token: string, userToUnfollow: string): Promise<[followerCount: number, followeeCount: number]> {
        if (!await this.checkAuthorization(token)) {
            throw new Error("Unauthorized: Your session has expired.")
        }

        const currentUserSession = await this.sessionProvider.getSession(token);
        const currentUser = await this.usersProvider.getUser(currentUserSession!.alias);
        const otherUser = await this.usersProvider.getUser(userToUnfollow);

        const oldFollow: Follow = new Follow(
            otherUser!.alias, otherUser!.firstName, otherUser!.lastName, otherUser!.imageUrl, 
            currentUser!.alias, currentUser!.firstName, currentUser!.lastName, currentUser!.imageUrl
        );
        await this.followsProvider.deleteFollow(oldFollow);

        return await this.updateFollowingCounts(token, userToUnfollow);
    };


    private async checkAuthorization(token: string): Promise<boolean> {
        const result = await this.sessionProvider.getSession(token);

        if (typeof result ==="undefined") {
            throw new Error("Unauthenticated: You cannot access the resource at this time");
        }

        if (result.lastActivityTimestamp < (Date.now() + result.ttl)) {
            await this.sessionProvider.updateSessionActivity(token);
            return true;
        }

        await this.sessionProvider.deleteSession(token, null);
        return false;
    }

    private async updateFollowingCounts(token: string, userToUpdate: string): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToUpdate);
        const followeeCount = await this.getFolloweeCount(token, userToUpdate);

        return [followerCount, followeeCount];
    }
    
}

export default UserService;
