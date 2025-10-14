import { AuthToken, User, Status } from "tweeter-shared";
import UserService from "../../models/UserService";
import BasePresenter, { PresenterView } from "../BasePresenter";

export interface StatusItemView extends PresenterView {
    addItems: (items: Status[]) => void
}

abstract class StatusItemPresenter extends BasePresenter<StatusItemView> {
    private _hasMoreItems: boolean = true;
    private _lastItem: Status | null = null;
    private userService: UserService;

    protected constructor(view: StatusItemView) {
        super(view);
        this.userService = new UserService();
    }

    protected set hasMoreItems(newValue: boolean) { this._hasMoreItems = newValue; }
    protected set lastItem(newValue: Status | null) { this._lastItem = newValue; }

    public get hasMoreItems(): boolean{ return this._hasMoreItems; }
    protected get lastItem(): Status | null { return this._lastItem; }

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
