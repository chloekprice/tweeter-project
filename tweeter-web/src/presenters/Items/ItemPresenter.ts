import { AuthToken, User } from "tweeter-shared";
import UserService from "../../models/UserService";
import BasePresenter, { PresenterView } from "../BasePresenter";
import { Service } from "../../models/Service";


export const PAGE_SIZE = 10;

export interface ItemView<T> extends PresenterView {
    addItems: (items: T[]) => void
}

abstract class ItemPresenter<T, S extends Service> extends BasePresenter<ItemView<T>> {
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;
    private userService: UserService;
    private _service: S;

    public constructor(view: ItemView<T>) {
        super(view);
        this.userService = new UserService();
        this._service = this.serviceFactory();
    }

    protected set hasMoreItems(newValue: boolean) { this._hasMoreItems = newValue; }
    protected set lastItem(newValue: T | null) { this._lastItem = newValue; }
    
    public get hasMoreItems() { return this._hasMoreItems }
    protected get lastItem() { return this._lastItem }
    protected get service() { return this._service }

    protected abstract getItemDescription(): string 
    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>
    protected abstract serviceFactory(): S

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        await this.performThrowingFunction( async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, this.getItemDescription())
    };

    public reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }
}

export default ItemPresenter;
