import { render, screen } from "@testing-library/react"
import PostStatus from "../../../src/views/postStatus/PostStatus"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";
import PostPresenter from "../../../src/presenters/PostPresenter";
import { deepEqual, instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/views/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);


jest.mock("../../../src/views/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/views/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));      

describe("Post Status View", () => {
    let mockUserInstance: User;
    let mockAuthTokenInstance: AuthToken;

    beforeAll( () => {
        mockUserInstance = instance(mock<User>());
        mockAuthTokenInstance = instance(mock<AuthToken>());

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
});      
    })

    it("first renders the Post Status and Clear buttons as disabled", () => {
        const { clearButton, postButton } = renderPostStatusAndGetElements();
        expect(clearButton).toBeDisabled();
        expect(postButton).toBeDisabled();
    })

    it("enables post status and clear buttons when the text field has text", async () => {
        const { clearButton, postButton, user, statusField } = renderPostStatusAndGetElements();

        await user.type(statusField, "hey");
        expect(clearButton).toBeEnabled();
        expect(postButton).toBeEnabled();
    })

    it("disables post status and clear buttons when the text field is cleared", async () => {
        const { clearButton, postButton, user, statusField } = renderPostStatusAndGetElements();

        await user.type(statusField, "hey");
        expect(clearButton).toBeEnabled();
        expect(postButton).toBeEnabled();

        await user.clear(statusField);
        expect(clearButton).toBeDisabled();
        expect(postButton).toBeDisabled();
    })

    it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter: PostPresenter = mock<PostPresenter>();
        const mockPresenterInstance: PostPresenter = instance(mockPresenter);

        const postStatus: string = "hey!";
        const { clearButton, postButton, user, statusField } = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(statusField, "hey!");
        expect(clearButton).toBeEnabled();
        expect(postButton).toBeEnabled();

        await user.click(postButton);
        verify(mockPresenter.submitPost(postStatus, deepEqual(mockUserInstance), deepEqual(mockAuthTokenInstance))).once();
    })
})

function renderPostStatus(presenter?: PostPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenter={presenter} /> 
                ) : (
                <PostStatus />
            )}
        </MemoryRouter>
    );
}

function renderPostStatusAndGetElements(presenter?: PostPresenter) {
    const user = userEvent.setup();
    renderPostStatus(presenter);

    const clearButton = screen.getByRole("button", {name: /clear/});
    const postButton = screen.getByRole("button", {name: /post/});
    const statusField = screen.getByLabelText("status-content");

    return { user, clearButton, postButton, statusField };
}
