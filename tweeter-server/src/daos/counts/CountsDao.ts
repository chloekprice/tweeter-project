import { Count } from "../../entities/Count"

export interface CountsDao {
    addCount(count: Count): Promise<void>
    getCount(alias: string): Promise<Count | undefined>
    updateFolloweeCount(alias: string, isIncreasing: boolean): Promise<void>
    updateFollowerCount(alias: string, isIncreasing: boolean): Promise<void>
}
