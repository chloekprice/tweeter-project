import { AuthToken, Status, User } from "tweeter-shared";
import PostService from "../models/PostService";
import BasePresenter, { PresenterView } from "./BasePresenter";

export interface PostView extends PresenterView {
    deleteMsg:  (_toast: string) => void
    displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setIsLoading: (isLoading: boolean) => void
    setPost: (post: string) => void

}

class PostPresenter extends BasePresenter<PostView> {
    private postService: PostService;

    public constructor(view: PostView) {
        super(view);
        this.postService = new PostService();
    }

    public async submitPost(post: string, postUser: User, authToken: AuthToken) {    
        var postingStatusToastId = "";
    
        await this.performThrowingFunction( async () => {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMsg("Posting status...", 0);
        
            const status = new Status(post, postUser, Date.now());
        
            await this.postService.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMsg("Status posted!", 2000);
        }, "post the status").then( () => {
            this.view.deleteMsg(postingStatusToastId);
            this.view.setIsLoading(false);
        })
    }
}

export default PostPresenter;
