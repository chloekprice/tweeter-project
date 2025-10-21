import { AuthToken } from "tweeter-shared";
import PostService from "../../src/models/PostService";
import PostPresenter, { PostView } from "../../src/presenters/PostPresenter"
import { anything, instance, mock, spy, when } from "@typestrong/ts-mockito";

describe("PostPresenter", () => {
    let mockPostPresenterView: PostView;
    let postPresenterSpyInstance: PostPresenter;
    let mockService: PostService;

    const authToken = new AuthToken("iloveicecream", Date.now());

    beforeEach( () => {
        mockPostPresenterView = mock<PostView>();
        mockService = mock<PostService>();

        const mockPostPresenterViewInstance = instance(mockPostPresenterView);
        const mockServiceInstance = instance(mockService);

        let postPresenter = new PostPresenter(mockPostPresenterViewInstance);
        let postPresenterSpy = spy(postPresenter);
        postPresenterSpyInstance = instance(postPresenterSpy);

        when(postPresenterSpyInstance.postService).thenReturn(mockServiceInstance);
        when(mockPostPresenterView.displayInfoMsg(anything(), 0)).thenReturn("messageId");
    })
})
