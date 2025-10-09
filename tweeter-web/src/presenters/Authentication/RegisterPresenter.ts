import AuthenticationPresenter, { AuthenticationView } from "./AuthenticationPresenter";

class RegisterPresenter extends AuthenticationPresenter {

    public constructor(view: AuthenticationView) {
        super(view);
    }
}

export default RegisterPresenter;
