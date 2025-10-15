import { User, AuthToken } from "tweeter-shared";
import AuthenticationPresenter, { AuthenticationInfo, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView { }
export interface LoginInfo extends AuthenticationInfo { }

class LoginPresenter extends AuthenticationPresenter<LoginView, LoginInfo> {

    constructor(view: LoginView) {
        super(view)
    }

    protected async authenticate(authInfo: AuthenticationInfo): Promise<[User, AuthToken]> {
        return await this.service.login(authInfo.alias, authInfo.password)
    }
    protected getAuthDescription(): string {
        return "log user in";
    }
}

export default LoginPresenter;
