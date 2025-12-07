import { Count } from "../../entities/Count"

export interface CountsDao {
    addCount(count: Count): Promise<void>
    getCount(alias: string): Promise<Count | undefined>
    updateFolloweeCount(count: Count, isIncreasing: boolean): Promise<void>
    updateFollowerCount(count: Count, isIncreasing: boolean): Promise<void>
}
