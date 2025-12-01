import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";


class AuthenticationService {
    private serverFacade: ServerFacade = new ServerFacade();
    
    public async logUserOut(authToken: AuthToken, user: User): Promise<void> {
        await this.serverFacade.logoutUser({ token: authToken.token, userAlias: user.alias })
    }

    public async login(alias: string, password: string): Promise<[User, AuthToken]>  {
        return await this.serverFacade.loginUser({ alias: alias, password: password })
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
        const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
        const imageUrl = `data:image/${imageFileExtension};base64,${imageStringBase64}`;
        
        return await this.serverFacade.registerUser({ firstName: firstName, lastName: lastName, alias: alias, password: password, imageUrl: imageUrl});
    }
}

export default AuthenticationService;
