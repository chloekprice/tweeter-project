import { Session } from "../../entities/Session"


export interface SessionsDao {
    addSession(session: Session): Promise<void>
    deleteSession(token: string, alias: string | null): Promise<void>
    getSession(token: string): Promise<Session | undefined>
    updateSessionActivity(token: string): Promise<void>
}
