import { Status } from "tweeter-shared";
import BasePresenter, { PresenterView } from "../BasePresenter";

export interface ItemView<T>  extends PresenterView {
    addItems: (items: T[]) => void
}

abstract class ItemPresenter extends BasePresenter<ItemView<Status>> {
    
}

export default ItemPresenter;
