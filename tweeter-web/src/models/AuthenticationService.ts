import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";


class AuthenticationService {
    private serverFacade: ServerFacade = new ServerFacade();
    
    public async logUserOut(authToken: AuthToken, user: User): Promise<void> {
        this.serverFacade.logoutUser({ token: authToken.token, userAlias: user.alias })
    }

    public async login(alias: string, password: string): Promise<[User, AuthToken]>  {
        return this.serverFacade.loginUser({ alias: alias, password: password })
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
        return this.serverFacade.registerUser({ firstName: firstName, lastName: lastName, alias: alias, password: password, imageUrl: "imageStringBase64"});
    }
}

export default AuthenticationService;
