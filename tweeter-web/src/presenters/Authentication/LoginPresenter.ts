import { User, AuthToken } from "tweeter-shared";
import AuthenticationService from "../../models/AuthenticationService";

export interface LoginView {
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    setAlias: (alias: string) => void
    setPassword: (password: string) => void
    setRememberMe: (rememberMe: boolean) => void
    setIsLoading: (isLoading: boolean) => void
    update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void 
}

class LoginPresenter {
    protected authService: AuthenticationService;
    private _view: LoginView;

    public constructor(view: LoginView) {
        this.authService = new AuthenticationService();
        this._view = view;
    }

    public get view(): LoginView { return this._view; };

    public async doLogin(alias: string, password: string, rememberMe: boolean): Promise<void> {
        try {
            this.view.setIsLoading(true);
            const [user, authToken] = await this.authService.login(alias, password);
            this.view.update(user, user, authToken, rememberMe);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to log user in because of exception: ${error}`);
        } finally {
            this.view.setIsLoading(false);
        }
    }
}

export default LoginPresenter;
