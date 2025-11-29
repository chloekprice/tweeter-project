import { DataPage } from "../../entities/DataPage";
import { Follow } from "../../entities/Follow";

export interface UsersDao {
  addFollow(follow: Follow): Promise<void> 
  deleteFollow(follow: Follow): Promise<void> 
  getFollow(follow: Follow): Promise<Follow | undefined>
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> 
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> 
}
