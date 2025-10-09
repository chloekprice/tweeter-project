import { Toast, ToastType } from "../views/toaster/Toast";
import { v4 as uuid } from "uuid";


export interface ToastView {
  displayExistingToast:  (toast: Toast) => void
  setToastList: (toastList: Toast[]) => void
}

class ToastPresenter {
  private _view: ToastView;

  public constructor(view: ToastView) {
    this._view = view;
  }

  public deleteAllToasts() {
    this.view.setToastList([]);
  }

  public deleteToast(id: string, currentList: Toast[]) {
      const filtered = currentList.filter((x) => x.id !== id);
      this.view.setToastList(filtered);
  }
  
  public get view(): ToastView { return this._view; }

  public displayToast(type: ToastType, text: string, deleteAfterMillis: number, title?: string, bootstrapClasses: string = ""): string {
    const toast = {
      id: uuid(),
      title: title ?? type,
      text: text,
      type: type,
      expirationMillisecond: deleteAfterMillis > 0 ? Date.now() + deleteAfterMillis : 0,
      bootstrapClasses: bootstrapClasses
    };

    this.view.displayExistingToast(toast);
    return toast.id;
  }

}

export default ToastPresenter;

