import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { Follow } from "../entities/Follow";


class UserService extends Service {

    
    public async follow(token: string, userToFollow: string): Promise<[followerCount: number, followeeCount: number]>  {
        return await this.performAuthorizedThrowingFunction<[followerCount: number, followeeCount: number]>(token, async () => {
            const currentUserSession = await Service.sessionProvider.getSession(token);
            const currentUser = await Service.usersProvider.getUser(currentUserSession!.alias);
            const otherUser = await Service.usersProvider.getUser(userToFollow);

            const newFollow: Follow = new Follow(
                otherUser!.alias, otherUser!.firstName, otherUser!.lastName, otherUser!.imageUrl, 
                currentUser!.alias, currentUser!.firstName, currentUser!.lastName, currentUser!.imageUrl
            );
            await Service.followsProvider.addFollow(newFollow);

            return await this.updateFollowingCounts(token, userToFollow);
        });
    };

    public async getFolloweeCount (token: string, userAlias: string): Promise<number> {
        return await this.performAuthorizedThrowingFunction<number>(token, async () => {
            return await Service.followsProvider.getFolloweeCount(userAlias);
        });
    };

    public async getFollowerCount (token: string, userAlias: string): Promise<number> {
        return await this.performAuthorizedThrowingFunction<number>(token, async () => {
            return await Service.followsProvider.getFollowerCount(userAlias);
        });
    };

    public async getIsFollowerStatus(token: string, userAlias: string, selectedUserAlias: string): Promise<boolean> {
        return await this.performAuthorizedThrowingFunction<boolean>(token, async () => {
            const followCheck: Follow = new Follow(selectedUserAlias, "", "", "", userAlias, "", "", "");
            const result: Follow | undefined = await Service.followsProvider.getFollow(followCheck);
            return typeof result === "undefined" ? false : true
        });
    };

    public async getUser (token: string, alias: string): Promise<UserDto | null>  {
        return await this.performAuthorizedThrowingFunction<UserDto | null>(token, async () => {
            return await Service.usersProvider.getUser(alias);
        });
    };

    public async unfollow(token: string, userToUnfollow: string): Promise<[followerCount: number, followeeCount: number]> {
        return await this.performAuthorizedThrowingFunction<[followerCount: number, followeeCount: number]>(token, async () => {
            const currentUserSession = await Service.sessionProvider.getSession(token);
            const currentUser = await Service.usersProvider.getUser(currentUserSession!.alias);
            const otherUser = await Service.usersProvider.getUser(userToUnfollow);

            const oldFollow: Follow = new Follow(
                otherUser!.alias, otherUser!.firstName, otherUser!.lastName, otherUser!.imageUrl, 
                currentUser!.alias, currentUser!.firstName, currentUser!.lastName, currentUser!.imageUrl
            );
            await Service.followsProvider.deleteFollow(oldFollow);

            return await this.updateFollowingCounts(token, userToUnfollow);
        });
    };


    private async updateFollowingCounts(token: string, userToUpdate: string): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToUpdate);
        const followeeCount = await this.getFolloweeCount(token, userToUpdate);

        return [followerCount, followeeCount];
    }
    
}

export default UserService;
