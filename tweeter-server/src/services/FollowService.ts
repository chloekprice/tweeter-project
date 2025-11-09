import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";


class FollowService implements Service {

    public async loadMoreFollowees (token: string, userAlias: string, pageSize: number, lastFollowee: UserDto | null): Promise<[UserDto[], boolean]>  {
        return this.getFakeData(lastFollowee, pageSize, userAlias);
    };

    public async loadMoreFollowers (token: string, userAlias: string, pageSize: number, lastFollower: UserDto | null): Promise<[UserDto[], boolean]> {
        return this.getFakeData(lastFollower, pageSize, userAlias);
    };

    private async getFakeData(lastFollower: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const [users, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastFollower), pageSize, userAlias);
        const dtos = users.map((user) => user.dto);
        return [dtos, hasMore];
    }

}

export default FollowService;
