import { TweeterRequest } from "./TweeterRequest";

export interface FollowerStatusRequest extends TweeterRequest {
    readonly selectedUserAlias: string
}
