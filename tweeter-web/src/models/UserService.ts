import { AuthToken, User, FakeData } from "tweeter-shared";


class UserService {

    
    public async getFolloweeCount (
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    };

    public async getFollowerCount (
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null>  {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };
    
}

export default UserService;
