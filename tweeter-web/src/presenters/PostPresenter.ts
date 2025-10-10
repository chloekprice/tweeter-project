import { AuthToken, Status, User } from "tweeter-shared";
import PostService from "../models/PostService";

export interface PostView {
    deleteMsg:  (_toast: string) => void
    displayErrorMsg: (message: string, bootstrapClasses?: string | undefined) => string
    displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setIsLoading: (isLoading: boolean) => void
    setPost: (post: string) => void

}

class PostPresenter {
    private postService: PostService;
    private _view: PostView;

    public constructor(view: PostView) {
        this.postService = new PostService();
        this._view = view;
    }

    public get view(): PostView { return this._view; }

    public async submitPost(post: string, postUser: User, authToken: AuthToken) {    
        var postingStatusToastId = "";
    
        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMsg("Posting status...", 0);
        
            const status = new Status(post, postUser, Date.now());
        
            await this.postService.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMsg("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMsg(`Failed to post the status because of exception: ${error}`);
        } finally {
            this.view.deleteMsg(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }
}

export default PostPresenter;
