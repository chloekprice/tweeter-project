import AuthenticationPresenter, { AuthenticationView } from "./AuthenticationPresenter";

class LoginPresenter extends AuthenticationPresenter {

    public constructor(view: AuthenticationView) {
        super(view);
    }
}

export default LoginPresenter;
