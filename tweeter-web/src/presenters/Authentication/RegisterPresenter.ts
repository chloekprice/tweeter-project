import AuthenticationPresenter, { AuthenticationView } from "./AuthenticationPresenter";

class RegisterPresenter extends AuthenticationPresenter {

    public constructor(view: AuthenticationView) {
        super(view);
    }

    checkSubmitButtonStatus(): boolean {
        throw new Error("Method not implemented.");
    }
    
    doAuth(): void {
        throw new Error("Method not implemented.");
    }
}

export default RegisterPresenter;
