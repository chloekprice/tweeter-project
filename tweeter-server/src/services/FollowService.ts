import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { FollowsDao } from "../daos/follows/FollowsDao";
import { UsersDao } from "../daos/users/UsersDao";
import { DataPage } from "../entities/DataPage";
import { Follow } from "../entities/Follow";


class FollowService implements Service {
    private followsProvider: FollowsDao;
    private usersProvider: UsersDao;

    constructor(daoProvider: DatabaseFactory) {
        this.followsProvider = daoProvider.createFollowsDao();
        this.usersProvider = daoProvider.createUsersDao();
    }
    

    public async loadMoreFollowees (token: string, userAlias: string, pageSize: number, lastFollowee: UserDto | null): Promise<[UserDto[], boolean]>  {
        // check authorization
        const page = await this.followsProvider.getPageOfFollowees(userAlias, pageSize, lastFollowee?.alias);
        const followeesList = await this.getUsersListFromPage(page);
        return [ followeesList, page.hasMorePages]
    };

    public async loadMoreFollowers (token: string, userAlias: string, pageSize: number, lastFollower: UserDto | null): Promise<[UserDto[], boolean]> {
        // check authorization
        const page = await this.followsProvider.getPageOfFollowees(userAlias, pageSize, lastFollower?.alias);
        const followersList = await this.getUsersListFromPage(page);
        return [ followersList, page.hasMorePages]
    };


    private async getUsersListFromPage(page: DataPage<Follow>): Promise<UserDto[]> {
        // get users from list of follows
    }

}

export default FollowService;
