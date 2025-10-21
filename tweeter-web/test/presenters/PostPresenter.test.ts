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

        let [calledAuthToken, calledStatus] = capture(mockService.postStatus).last();

        expect(calledAuthToken).toEqual(authToken);
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
})
