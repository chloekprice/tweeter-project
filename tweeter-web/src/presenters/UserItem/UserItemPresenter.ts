import { AuthToken } from "tweeter-shared";
import { User } from "tweeter-shared/dist/model/domain/User";
import UserService from "../../models/UserService";


export interface UserItemView {
    addItems: (items: User[]) => void
    displayErrorMsg: (message: string) => void
}


abstract class UserItemPresenter {
    private _hasMoreItems: boolean = true;
    private _lastItem: User | null = null;
    private userService: UserService;
    private _view: UserItemView;



    protected constructor(view: UserItemView) {
        this.userService = new UserService();
        this._view = view;
    }

    protected set hasMoreItems(newValue: boolean) { this._hasMoreItems = newValue; }
    protected set lastItem(newValue: User | null) { this._lastItem = newValue; }

    public get hasMoreItems() { return this._hasMoreItems }
    protected get lastItem() { return this._lastItem }
    protected get view() { return this._view; }

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
