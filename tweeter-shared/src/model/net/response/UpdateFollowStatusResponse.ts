import { TweeterResponse } from "./TweeterResponse";

export interface UpdateFollowStatusResponse extends TweeterResponse {
    readonly followerCount: number
    readonly followeeCount: number
}
