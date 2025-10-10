import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import AuthenticationService from "../models/AuthenticationService";

export interface NavbarView {
    deleteMsg: (_toast: string) => void
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
}

class NavbarPresenter {
    private authService: AuthenticationService;
    private _view: NavbarView;

    public constructor(view: NavbarView) { 
        this.authService = new AuthenticationService();
        this._view = view;
    }

    public get view(): NavbarView { return this._view; }

    public async logout(authToken: AuthToken): Promise<void> {
        const loggingOutToastId = this.view.displayInfoMsg("Logging Out...", 0);

        try {
            await this.authService.logUserOut(authToken);
            this.view.deleteMsg(loggingOutToastId);
        } catch (error) {
           this.view.displayErrorMsg(`Failed to log user out because of exception: ${error}`);
        }
    }
}

export default NavbarPresenter;
