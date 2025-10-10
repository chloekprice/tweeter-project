import { AuthToken, User, Status } from "tweeter-shared";
import UserService from "../../models/UserService";

export interface StatusItemView {
    addItems: (items: Status[]) => void
    displayErrorMsg: (message: string) => void
}

abstract class StatusItemPresenter {
    private _hasMoreItems: boolean = true;
    private _lastItem: Status | null = null;
    private userService: UserService;
    private _view: StatusItemView

    protected constructor(view: StatusItemView) {
        this.userService = new UserService();
        this._view = view;
    }

    protected set hasMoreItems(newValue: boolean) { this._hasMoreItems = newValue; }
    protected set lastItem(newValue: Status | null) { this._lastItem = newValue; }

    public get hasMoreItems(): boolean{ return this._hasMoreItems; }
    protected get lastItem(): Status | null { return this._lastItem; }
    protected get view() { return this._view; }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };

    public reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }
}

export default StatusItemPresenter;
