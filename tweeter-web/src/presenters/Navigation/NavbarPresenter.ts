import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import AuthenticationService from "../../models/AuthenticationService";
import BasePresenter, { EnhancedView } from "../BasePresenter";
import { User } from "tweeter-shared";

export interface NavbarView extends EnhancedView { 
    clearUserInfo: () => void
    navigate: (url: string) => void
}

class NavbarPresenter extends BasePresenter<NavbarView> {
    private _authService: AuthenticationService;

    public constructor(view: NavbarView) { 
        super(view);
        this._authService = new AuthenticationService();
    }

    public get authService(): AuthenticationService { return this._authService; }

    public async logout(authToken: AuthToken, user: User): Promise<void> {
        await this.performThrowingFunction( async () => {
            const loggingOutToastId = this.view.displayInfoMsg("Logging Out...", 0);
            await this.authService.logUserOut(authToken, user);
            this.view.deleteMsg(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out")
    }
}

export default NavbarPresenter;
