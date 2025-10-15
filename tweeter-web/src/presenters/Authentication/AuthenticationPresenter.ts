import { User, AuthToken } from "tweeter-shared"
import BasePresenter, { PresenterView } from "../BasePresenter"
import AuthenticationService from "../../models/AuthenticationService"

export interface AuthenticationView extends PresenterView {
    setAlias: (alias: string) => void
    setPassword: (password: string) => void
    setRememberMe: (rememberMe: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void 
}

export interface AuthenticationInfo {
    alias: string
    password: string
}


abstract class AuthenticationPresenter<V extends AuthenticationView, T extends AuthenticationInfo> extends BasePresenter<V> {
    protected service: AuthenticationService;

    public constructor(view: V) {
        super(view);
        this.service = new AuthenticationService();
    }

    protected abstract authenticate(authInfo: T): Promise<[User, AuthToken]>
    protected abstract getAuthDescription(): string

    public async doAuth(authInfo: T, rememberMe: boolean): Promise<void> {
        await this.performThrowingFunction( async() => {
            this.view.setIsLoading(true);
            const [user, authToken] = await this.authenticate(authInfo);
            this.view.update(user, user, authToken, rememberMe);
        }, this.getAuthDescription()).then( () => { this.view.setIsLoading(false); })
    }
}

export default AuthenticationPresenter;
