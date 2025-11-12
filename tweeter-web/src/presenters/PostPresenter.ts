import { AuthToken, Status, User } from "tweeter-shared";
import PostService from "../models/PostService";
import BasePresenter, { EnhancedView } from "./BasePresenter";

export interface PostView extends EnhancedView {
    setIsLoading: (isLoading: boolean) => void
    setPost: (post: string) => void

}

class PostPresenter extends BasePresenter<PostView> {
    private _postService: PostService;

    public constructor(view: PostView) {
        super(view);
        this._postService = new PostService();
    }

    public get postService(): PostService { return this._postService; }

    public async submitPost(post: string, postUser: User, authToken: AuthToken) {    
        var postingStatusToastId = "";
    
        await this.performThrowingFunction( async () => {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMsg("Posting status...", 0);
        
            const status = new Status(post, postUser, Date.now());
        
            await this.postService.postStatus(authToken, postUser, status);

            this.view.setPost("");
        }, "post the status").then( () => {
            this.view.deleteMsg(postingStatusToastId);
            this.view.setIsLoading(false);
            this.view.displayInfoMsg("Status posted!", 2000);
        })
    }
}

export default PostPresenter;
