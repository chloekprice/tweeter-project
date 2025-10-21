import { mock, instance, verify, anything } from "@typestrong/ts-mockito"
import NavbarPresenter, { NavbarView } from "../../src/presenters/Navigation/NavbarPresenter"
import { AuthToken } from "tweeter-shared";

describe("NavbarPresenter", () => {
    let mockNavbarPresenterView: NavbarView;
    let navbarPresenter: NavbarPresenter;

    const authToken = new AuthToken("tristanbrownishot", Date.now());

    beforeEach( () => {
        mockNavbarPresenterView = mock<NavbarView>();
        const mockNavbarPresenterViewInstance = instance(mockNavbarPresenterView);
        navbarPresenter = new NavbarPresenter(mockNavbarPresenterViewInstance);
    })

    it("tells the view to display a logging out message", async () => {
        await navbarPresenter.logout(authToken);
        verify(mockNavbarPresenterView.displayInfoMsg("Logging Out...", 0)).once()
    })
})
