import { User } from "../../entities/User";

export interface UsersDao {
    addUser(user: User): Promise<void>
    deleteUser(alias: string): Promise<void>
    getUser(alias: string): Promise<User | undefined> 
}
