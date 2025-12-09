import { DataPage } from "../../entities/DataPage"
import { Feed } from "../../entities/Feed"

export interface FeedsDao {
    batchAddToFeed(feedPosts: Feed[]): Promise<void>
    addToFeed(feedPost: Feed): Promise<void> 
    getPageOfFeeds(userAlias: string, pageSize: number, lastItem: Feed | undefined): Promise<DataPage<Feed>> 
}
