import { render, screen } from "@testing-library/react"
import PostStatus from "../../../src/views/postStatus/PostStatus"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";
import PostPresenter from "../../../src/presenters/PostPresenter";
import { deepEqual, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Post Status View", () => {

    it("first renders the Post Status and Clear buttons as disabled", () => {
        const { clearButton, postButton } = renderPostStatusAndGetElements();
        expect(clearButton).toBeDisabled();
        expect(postButton).toBeDisabled();
    })
})

function renderPostStatus(presenter?: PostPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenter={presenter} /> 
                ) : (
                <PostStatus/>
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
