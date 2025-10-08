
export interface StatusItemView {
    
}

abstract class StatusItemPresenter {
    private _view: StatusItemView

    protected constructor(view: StatusItemView) {
        this._view = view;
    }

}

export default StatusItemPresenter;
