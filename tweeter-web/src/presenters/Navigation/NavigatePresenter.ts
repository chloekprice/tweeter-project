import { AuthToken, User } from "tweeter-shared";
import UserService from "../../models/UserService";
import BasePresenter, { PresenterView } from "../BasePresenter";


export interface NavigateView extends PresenterView {
}

class NavigatePresenter extends BasePresenter<NavigateView> {
    private userService: UserService;

    public constructor(view: NavigateView) {
        super(view);
        this.userService = new UserService();
    }


    public async getUser(authToken: AuthToken, target: string): Promise<User | null> {
        let toUser: User | null = null;
        await this.performThrowingFunction( async () => {
            const alias = this.extractAlias(target);
            toUser = await this.userService.getUser(authToken, alias);
        }, "get user")
        return toUser;
    }
    
    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}

export default NavigatePresenter;
