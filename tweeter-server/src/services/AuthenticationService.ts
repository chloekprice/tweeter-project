import { FakeData, AuthTokenDto, UserDto } from "tweeter-shared";


class AuthenticationService {

    
    public async logUserOut(token: string, userAlias: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server backend is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }

    public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>  {
        return this.getFakeData();
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, profileImage: string): Promise<[UserDto, AuthTokenDto]> {
        return this.getFakeData();
    }

    private async getFakeData(): Promise<[UserDto, AuthTokenDto]> {
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid authentication");
        }
    
        return [user, FakeData.instance.authToken];
    }
}

export default AuthenticationService;
