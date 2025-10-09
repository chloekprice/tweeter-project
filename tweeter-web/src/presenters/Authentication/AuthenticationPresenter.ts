import { User, AuthToken } from "tweeter-shared";
import AuthenticationService from "../../models/AuthenticationService";

export interface AuthenticationView {

}

abstract class AuthenticationPresenter {
    protected authService: AuthenticationService;
    private _view: AuthenticationView;

    public constructor(view: AuthenticationView) {
        this.authService = new AuthenticationService();
        this._view = view;
    }

    public get view(): AuthenticationView { return this._view; }

}

export default AuthenticationPresenter;
