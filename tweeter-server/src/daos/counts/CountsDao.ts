import { Count } from "../../entities/Count"

export interface CountsDao {
    addCount(): Promise<void>
    updateCount(): Promise<void>
    getCount(): Promise<Count>
}
