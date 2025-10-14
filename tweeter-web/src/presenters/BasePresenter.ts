

export interface PresenterView {
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
}

abstract class BasePresenter< V extends PresenterView> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view(): V { return this._view; }

    protected async performThrowingFunction(operation: () => Promise<void>, description: string) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMsg(`Failed to ${description} because of exception: ${error}`);
        }
    };
}

export default BasePresenter;
