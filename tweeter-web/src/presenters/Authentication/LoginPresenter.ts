import { User, AuthToken } from "tweeter-shared";
import AuthenticationService from "../../models/AuthenticationService";
import BasePresenter, { PresenterView } from "../BasePresenter";

export interface LoginView extends PresenterView {
    setAlias: (alias: string) => void
    setPassword: (password: string) => void
    setRememberMe: (rememberMe: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void 
}

class LoginPresenter extends BasePresenter<LoginView> {
    protected authService: AuthenticationService;

    public constructor(view: LoginView) {
        super(view);
        this.authService = new AuthenticationService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean): Promise<void> {
        await this.performThrowingFunction( async() => {
            this.view.setIsLoading(true);
            const [user, authToken] = await this.authService.login(alias, password);
            this.view.update(user, user, authToken, rememberMe);
        }, "log user in").then( () => { this.view.setIsLoading(false); })
    }
}

export default LoginPresenter;
