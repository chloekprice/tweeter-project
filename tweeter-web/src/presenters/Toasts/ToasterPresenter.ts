import { Toast } from "../../views/toaster/Toast";


export interface ToasterView {
    deleteMsg: (_toast: string) => void
}

class ToasterPresenter {
    private _view: ToasterView;

    public constructor(view: ToasterView) {
        this._view = view;
    }
    
    public get view(): ToasterView { return this._view; }

    public deleteExpiredToasts(msgList: Toast[]) {
      const now = Date.now();
  
      for (let msg of msgList) {
            if (msg.expirationMillisecond > 0 && msg.expirationMillisecond < now) {
                this.view.deleteMsg(msg.id);
            }
      }
    };
  

}

export default ToasterPresenter;
