import { StatusDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DataPage } from "../entities/DataPage";
import { User } from "../entities/User";
import { Status } from "../entities/Status";
import { Feed } from "../entities/Feed";


class StatusService extends Service {


    public async loadMoreFeedStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>  {
        return await this.performAuthorizedThrowingFunction<[StatusDto[], boolean]>(token, async () => {
            const lastFeed = lastItem == null ? 
                undefined : {
                    userAlias: userAlias,
                    user: {
                        alias: lastItem!.user.alias,
                        firstName: lastItem!.user.firstName,
                        lastName: lastItem!.user.lastName,
                        passwordHash: "",
                        imageUrl: lastItem!.user.imageUrl
                    },
                    timestamp: lastItem!.timestamp, 
                    status: this.getStatusFromDto(lastItem)
                }

            const page = await Service.feedsProvider.getPageOfFeeds(userAlias, pageSize, lastFeed);

            return [this.getStatusDtosFromFeedPage(page), page.hasMorePages];
        });
    };
    
    public async loadMoreStoryStatuses (token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
        return await this.performAuthorizedThrowingFunction<[StatusDto[], boolean]>(token, async () => {
            const user = await Service.usersProvider.getUser(userAlias);
            if (user == null) {
                throw new Error(`The selected user ${userAlias} does not exist`);
            }

            const lastStatus = lastItem == null ? 
                undefined : {
                    userAlias: lastItem!.user.alias, 
                    timestamp: lastItem!.timestamp, 
                    post: lastItem!.post, 
                    segments: (lastItem!.segments ?? []).map(seg => ({
                        text: seg.text,
                        startPosition: seg.startPostion,
                        endPosition: seg.endPosition,
                        type: seg.type
                    }))
                }
            const page = await Service.statusesProvider.getPageOfStatuses(userAlias, pageSize, lastStatus);
            
            return [this.getStatusDtosFromStatusPage(page, user), page.hasMorePages];
        });
    };

    private getStatusFromDto(status: StatusDto): Status {
        return new Status(
            status.user.alias,
            status.timestamp, 
            status.post,
            (status.segments ?? []).map(seg => ({
                text: seg.text,
                startPosition: seg.startPostion,
                endPosition: seg.endPosition,
                type: seg.type
            }))
        );
    }

    private getStatusDtosFromFeedPage(page: DataPage<Feed>): StatusDto[] {
        const feeds: StatusDto[] = page.values.map((value) => ({
            post: value.status.post, 
            user: {
                firstName: value.user.firstName,
                lastName: value.user.lastName,
                alias: value.user.alias,
                imageUrl: value.user.imageUrl
            },
            timestamp: value.timestamp,
            segments: (value.status.segments ?? []).map(seg => ({
                text: seg.text,
                startPostion: seg.startPosition,
                endPosition: seg.endPosition,
                type: seg.type
            }))
        }));

        return feeds;
    }

    private getStatusDtosFromStatusPage(page: DataPage<Status>, user: User): StatusDto[] {
        const userDto: UserDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl
        }

        const statuses: StatusDto[] = page.values.map((value) => ({
            post: value.post, 
            user: userDto,
            timestamp: value.timestamp,
            segments: (value.segments ?? []).map(seg => ({
                text: seg.text,
                startPostion: seg.startPosition,
                endPosition: seg.endPosition,
                type: seg.type
            }))
        }));

        return statuses;
    }
}

export default StatusService;
