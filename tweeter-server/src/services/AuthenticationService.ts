import { FakeData, AuthTokenDto, UserDto } from "tweeter-shared";
import { SessionsDao } from "../daos/sessions/SessionsDao";
import { DatabaseFactory } from "../daos/DatabaseFactory";
import { Session } from "../entities/Session";


class AuthenticationService {
    private sessionProvider: SessionsDao;
    
    constructor(daoProvider: DatabaseFactory) {
        this.sessionProvider = daoProvider.createSessionsDao();
    }
    
    TIME_TO_LIVE: number = 1800000 // 30 minutes

    public async logUserOut(token: string, userAlias: string): Promise<void> {
        await this.sessionProvider.deleteSession(token, userAlias);
    }

    public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>  {
        const authToken = await this.authenticateUser(alias);
        
        return this.getFakeData();
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, profileImage: string): Promise<[UserDto, AuthTokenDto]> {
        const authToken = await this.authenticateUser(alias);

        return this.getFakeData();
    }


    private async authenticateUser(alias: string): Promise<AuthTokenDto> {
        const token = crypto.randomUUID(); 
        const newSession: Session = new Session(token, alias, Date.now(), this.TIME_TO_LIVE);

        await this.sessionProvider.addSession(newSession);

        return this.getAuthTokenFromSession(newSession);
    }

    private getAuthTokenFromSession(session: Session): AuthTokenDto {
        return {
            token: session.token,
            timestamp: session.lastActivityTimestamp
        }
    }

    private async getFakeData(): Promise<[UserDto, AuthTokenDto]> {
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid authentication");
        }
    
        return [user.dto, FakeData.instance.authToken.dto];
    }
}

export default AuthenticationService;
