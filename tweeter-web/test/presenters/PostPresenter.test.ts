import { AuthToken, User } from "tweeter-shared";
import PostService from "../../src/models/PostService";
import PostPresenter, { PostView } from "../../src/presenters/PostPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

describe("PostPresenter", () => {
    let mockPostPresenterView: PostView;
    let postPresenterSpyInstance: PostPresenter;
    let mockService: PostService;

    const authToken = new AuthToken("iloveicecream", Date.now());

    beforeEach( () => {
        mockPostPresenterView = mock<PostView>();
        mockService = mock<PostService>();

        let mockPostPresenterViewInstance = instance(mockPostPresenterView);
        let mockServiceInstance = instance(mockService);

        let postPresenter = new PostPresenter(mockPostPresenterViewInstance);
        const postPresenterSpy = spy(postPresenter);
        postPresenterSpyInstance = instance(postPresenterSpy);

        when(postPresenterSpy.postService).thenReturn(mockServiceInstance);
        when(mockPostPresenterView.displayInfoMsg("Posting status...", 0)).thenReturn("messageId");
    })

    it("tells the view to display a posting status message", async () => {
        await postPresenterSpyInstance.submitPost(anything(), anything(), anything());
        verify(mockPostPresenterView.displayInfoMsg("Posting status...", 0)).once();
    })

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        const mockPost = "dummy post"
        const mockUser = new User("fake", "user", "@fake", "image");
    
        await postPresenterSpyInstance.submitPost(mockPost, mockUser, authToken);

        let [calledAuthToken, calledUser, calledStatus] = capture(mockService.postStatus).last();

        expect(calledAuthToken).toEqual(authToken);
        expect(calledUser).toEqual(mockUser);
        expect(calledStatus.post).toEqual(mockPost);
    })

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message, when successful post", async () => {
        const mockPost = "dummy post"
        const mockUser = new User("fake", "user", "@fake", "image");
    
        await postPresenterSpyInstance.submitPost(mockPost, mockUser, authToken);

        verify(mockPostPresenterView.displayInfoMsg("Status posted!", anything())).once()
        verify(mockPostPresenterView.setPost("")).once();
        verify(mockPostPresenterView.deleteMsg("messageId")).once();
    })

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message, when unsuccessful post", async () => {
        let error = new Error("an error occurred");
        const mockPost = "dummy post"
        const mockUser = new User("fake", "user", "@fake", "image");
    
        when(mockService.postStatus(authToken, mockUser, anything())).thenThrow(error);
        await postPresenterSpyInstance.submitPost(mockPost, mockUser, authToken);

        verify(mockPostPresenterView.displayInfoMsg("Status posted!", anything())).never()
        verify(mockPostPresenterView.setPost("")).never();
        verify(mockPostPresenterView.deleteMsg("messageId")).once();
        verify(mockPostPresenterView.displayErrorMsg("Failed to post the status because of exception: an error occurred")).once();
    })
})
