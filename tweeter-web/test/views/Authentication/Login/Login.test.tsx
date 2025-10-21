import { render, screen } from "@testing-library/react"
import Login from "../../../../src/views/authentication/login/Login"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

describe("Login View", () => {

    it("starts with the sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    })

    it("enables sign in button if both alias and password fields are filled", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

        await user.type(aliasField, "q");
        await user.type(passwordField, "t");

        expect(signInButton).toBeEnabled();
    })

    it("disables the sign in button if text is removed from alias or password fields", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

        await user.type(aliasField, "q");
        await user.type(passwordField, "t");

        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "w");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();

        await user.type(passwordField, "s");
        expect(signInButton).toBeEnabled();
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
