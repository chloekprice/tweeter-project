import { render, screen } from "@testing-library/react"
import Login from "../../../../src/views/authentication/login/Login"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

describe("Login View", () => {

    it("starts with the sign in button disabled", async () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    })
})

function renderLogin(originalUrl: string) {
    return render(
        <MemoryRouter>
            <Login originalUrl={originalUrl} />
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(originalUrl: string) {
    const user = userEvent.setup();
    renderLogin(originalUrl);

    const signInButton = screen.getByRole("button", {name: /Sign in/});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField };
}
