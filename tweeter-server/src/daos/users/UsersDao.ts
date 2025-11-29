import { User } from "../../entities/User";

export interface UsersDao {
    getUser(handle: string): Promise<User> 
}
