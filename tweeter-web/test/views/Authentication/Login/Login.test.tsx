import { render, screen } from "@testing-library/react"
import Login from "../../../../src/views/authentication/login/Login"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core";
import LoginPresenter from "../../../../src/presenters/Authentication/LoginPresenter";
import { deepEqual, instance, mock, verify } from "@typestrong/ts-mockito";

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

    it("calls presenter's login method with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter: LoginPresenter = mock<LoginPresenter>();
        const mockPresenterInstance: LoginPresenter = instance(mockPresenter);

        const alias: string = "@alias";
        const password: string = "password";
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/", mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        expect(signInButton).toBeEnabled();

        await user.click(signInButton);
        verify(mockPresenter.doAuth(deepEqual({ alias, password }), false)).once();

    })
})

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} /> 
                ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField };
}
