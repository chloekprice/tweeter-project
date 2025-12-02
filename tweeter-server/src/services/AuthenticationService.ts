import { AuthTokenDto, UserDto } from "tweeter-shared";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { Service } from "./Service";


class AuthenticationService extends Service {
    TIME_TO_LIVE: number = 300000 // 5 minutes
    SALT_ROUNDS: number = 10

   public async logUserOut(token: string, userAlias: string): Promise<void> {
        return await this.performThrowingFunction<void> (async () => 
            await Service.sessionProvider.deleteSession(token, userAlias)
        );
    }


    public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>  {
        return await this.performThrowingFunction<[UserDto, AuthTokenDto]> (async () => {
            const user = await Service.usersProvider.getUser(alias);

            if (user == null) {
                throw new Error(`No user with alias ${alias} exists`)
            }
            
            if (!await bcrypt.compare(password, user.passwordHash)) {
                throw new Error(`Incorrect password was entered.`);
            }

            return this.createDtos(user);
        });
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, profileImage: string): Promise<[UserDto, AuthTokenDto]> {
        return await this.performThrowingFunction<[UserDto, AuthTokenDto]>(async() => {
            const username = alias.startsWith("@") ? alias.slice(1) : alias;
            const profileImageUrl = await Service.imagesProvider.putImage(`${username}/profile`, profileImage);
            
            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
            const newUser = new User(alias, firstName, lastName, hashedPassword, profileImageUrl);
            await Service.usersProvider.addUser(newUser);
            
            return await this.createDtos(newUser);
        });
    }


    private async authenticateUser(alias: string): Promise<AuthTokenDto> {
        const token = crypto.randomUUID(); 
        const newSession: Session = new Session(token, alias, Date.now(), this.TIME_TO_LIVE);

        await Service.sessionProvider.addSession(newSession);

        return this.getAuthTokenDtoFromSession(newSession);
    }

    private async createDtos(user: User): Promise<[UserDto, AuthTokenDto]> {
        const userDto = this.getUserDtoFromUser(user);
        const authTokenDto = await this.authenticateUser(user.alias);

        return [userDto, authTokenDto];
    }

    private getAuthTokenDtoFromSession(session: Session): AuthTokenDto {
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
