import { AuthToken } from "tweeter-shared";
import PostService from "../../src/models/PostService";
import PostPresenter, { PostView } from "../../src/presenters/PostPresenter"
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

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
        when(mockPostPresenterView.displayInfoMsg(anything(), 0)).thenReturn("messageId");
    })

    it("tells the view to display a posting status message", async () => {
        await postPresenterSpyInstance.submitPost(anything(), anything(), authToken);
        verify(mockPostPresenterView.displayInfoMsg("Posting status...", 0)).once();
    })
})
