import { DataPage } from "../../entities/DataPage"
import { Status } from "../../entities/Status"

export interface StatusesDao  {
    addStatus(status: Status): Promise<void> 
    getPageOfStatuses(userAlias: string, pageSize: number, lastItem: Status | undefined): Promise<DataPage<Status>> 
}
