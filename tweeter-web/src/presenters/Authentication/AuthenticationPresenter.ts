import { User, AuthToken } from "tweeter-shared";
import AuthenticationService from "../../models/AuthenticationService";

export interface AuthenticationView {
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void 
}

abstract class AuthenticationPresenter {
    protected authService: AuthenticationService;
    private _isLoading = false;
    private _view: AuthenticationView;

    public constructor(view: AuthenticationView) {
        this.authService = new AuthenticationService();
        this._view = view;
    }

    public get isLoading(): boolean { return this._isLoading; }
    public get view(): AuthenticationView { return this._view; }

    public set isLoading(newValue: boolean) { this._isLoading = newValue; }
}

export default AuthenticationPresenter;
