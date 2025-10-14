import { AuthToken, User } from "tweeter-shared";
import UserService from "../../../models/UserService";
import BasePresenter, { PresenterView } from "../../BasePresenter";


export interface UserItemView extends PresenterView {
    addItems: (items: User[]) => void
}


abstract class UserItemPresenter extends BasePresenter<UserItemView> {
    private _hasMoreItems: boolean = true;
    private _lastItem: User | null = null;
    private userService: UserService;



    protected constructor(view: UserItemView) {
        super(view);
        this.userService = new UserService();
    }

    protected set hasMoreItems(newValue: boolean) { this._hasMoreItems = newValue; }
    protected set lastItem(newValue: User | null) { this._lastItem = newValue; }

    public get hasMoreItems() { return this._hasMoreItems }
    protected get lastItem() { return this._lastItem }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void

    public async getUser (authToken: AuthToken, alias: string): Promise<User | null>  {
        return this.userService.getUser(authToken, alias);
    };

    reset() { 
        this.lastItem = null;
        this.hasMoreItems = true;
    }
}

export default UserItemPresenter;
