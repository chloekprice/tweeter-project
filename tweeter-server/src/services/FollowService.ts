import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DataPage } from "../entities/DataPage";
import { Follow } from "../entities/Follow";


class FollowService extends Service {


    public async loadMoreFollowees(token: string, userAlias: string, pageSize: number, lastFollowee: UserDto | null): Promise<[UserDto[], boolean]>  {
        return await this.loadMoreUsersFromDatabase(
            token,
            () => Service.followsProvider.getPageOfFollowees(userAlias, pageSize, lastFollowee?.alias),
            this.getFolloweesFromPage
        );
    };

    public async loadMoreFollowers(token: string, userAlias: string, pageSize: number, lastFollower: UserDto | null): Promise<[UserDto[], boolean]> {
        return await this.loadMoreUsersFromDatabase(
            token,
            () => Service.followsProvider.getPageOfFollowers(userAlias, pageSize, lastFollower?.alias),
            this.getFollowersFromPage
        );
    };


    private getFolloweesFromPage(page: DataPage<Follow>): UserDto[] {
        const followees: UserDto[] = page.values.map((value) => ({
            firstName: value.followeeFirstName, 
            lastName: value.followeeLastName,
            alias: value.followeeHandle,
            imageUrl: value.followeeImageUrl
        }));
        return followees;
    }

    private getFollowersFromPage(page: DataPage<Follow>): UserDto[] {
        const followers: UserDto[] = page.values.map((value) => ({
            firstName: value.followerFirstName, 
            lastName: value.followerLastName,
            alias: value.followerHandle,
            imageUrl: value.followerImageUrl
        }));
        return followers;
    }

    private async loadMoreUsersFromDatabase(token: string, getPageOfUsers: () => Promise<DataPage<Follow>>, getUsersFromPage: (page: DataPage<Follow>) => UserDto[]): Promise<[UserDto[], boolean]>  {
        return await this.performAuthorizedThrowingFunction<[UserDto[], boolean]>(token, async() => {
            const page = await getPageOfUsers();
            const usersList = getUsersFromPage(page);
            return [usersList, page.hasMorePages]
        });
    };

}

export default FollowService;
