import { DataPage } from "../../entities/DataPage";
import { Follow } from "../../entities/Follow";

export interface FollowsDao {
  addFollow(follow: Follow): Promise<void> 
  deleteFollow(follow: Follow): Promise<void> 
  getFollow(follow: Follow): Promise<Follow | undefined>
  getFolloweeCount(alias: string): Promise<number>
  getFollowerCount(alias: string): Promise<number>
  getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<DataPage<Follow>> 
  getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<DataPage<Follow>> 
}
