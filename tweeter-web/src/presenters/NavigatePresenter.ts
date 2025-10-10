import { AuthToken, User } from "tweeter-shared";
import UserService from "../models/UserService";


export interface NavigateView {
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    setUser: (user: User) => void
}

class NavigatePresenter {
    private userService: UserService;
    private _view: NavigateView;

    public constructor(view: NavigateView) {
        this.userService = new UserService();
        this._view = view;
    }

    public get view(): NavigateView { return this._view; }

    public async navigateToUser(authToken: AuthToken, target: string, displayedUser: User): Promise<string> {
        try {
            const alias = this.extractAlias(target);
            const toUser = await this.userService.getUser(authToken, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser)) {
                    this.view.setUser(toUser);
                    return toUser.alias;
                }
            }
            return "";
        } catch (error) {
            this.view.displayErrorMsg(`Failed to get user because of exception: ${error}`);
            return "";
        }
    }
    
    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}

export default NavigatePresenter;
