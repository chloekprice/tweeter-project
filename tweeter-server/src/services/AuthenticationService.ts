import { AuthTokenDto, UserDto } from "tweeter-shared";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { Service } from "./Service";


class AuthenticationService extends Service {
    TIME_TO_LIVE: number = 1800000 // 30 minutes
    SALT_ROUNDS: number = 10

    public async logUserOut(token: string, userAlias: string): Promise<void> {
        await Service.sessionProvider.deleteSession(token, userAlias);
    }

    public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>  {
        const user = await Service.usersProvider.getUser(alias);

        if (user == null) {
            throw new Error(`Unauthorized Request: No user with alias ${alias} exists`)
        }
        
        if (!await bcrypt.compare(password, user.passwordHash)) {
            throw new Error(`Unauthorized Request: Incorrect password was entered.`);
        }

        const userDto = this.getUserDtoFromUser(user);
        const authTokenDto = await this.authenticateUser(alias);
        
        return [userDto, authTokenDto];
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, profileImage: string): Promise<[UserDto, AuthTokenDto]> {
        const username = alias.startsWith("@") ? alias.slice(1) : alias;
        const profileImageUrl = await Service.imagesProvider.putImage(`${username}/profile`, profileImage);
        
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        const newUser = new User(alias, firstName, lastName, hashedPassword, profileImageUrl);
        await Service.usersProvider.addUser(newUser);

        const userDto = this.getUserDtoFromUser(newUser);
        const authTokenDto = await this.authenticateUser(alias);
        
        return [userDto, authTokenDto];
    }


    private async authenticateUser(alias: string): Promise<AuthTokenDto> {
        const token = crypto.randomUUID(); 
        const newSession: Session = new Session(token, alias, Date.now(), this.TIME_TO_LIVE);

        await Service.sessionProvider.addSession(newSession);

        return this.getAuthTokenFromSession(newSession);
    }

    private getAuthTokenFromSession(session: Session): AuthTokenDto {
        return {
            token: session.token,
            timestamp: session.lastActivityTimestamp
        }
    }

    private getUserDtoFromUser(user: User): UserDto {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            alias: user.alias,
            imageUrl: user.imageUrl
        }
    }

}

export default AuthenticationService;
