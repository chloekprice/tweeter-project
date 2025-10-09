import AuthenticationPresenter, { AuthenticationView } from "./AuthenticationPresenter";

class LoginPresenter extends AuthenticationPresenter {

    public constructor(view: AuthenticationView) {
        super(view);
    }

    checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean): Promise<void> {
        try {
            this.isLoading = true;
            const [user, authToken] = await this.authService.login(alias, password);
            this.view.update(user, user, authToken, rememberMe);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to log user in because of exception: ${error}`);
        } finally {
            this.isLoading = false;
        }
    }
}

export default LoginPresenter;
