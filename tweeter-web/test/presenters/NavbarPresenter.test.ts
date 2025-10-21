import { mock, instance, verify, anything, spy, when } from "@typestrong/ts-mockito"
import NavbarPresenter, { NavbarView } from "../../src/presenters/Navigation/NavbarPresenter"
import { AuthToken } from "tweeter-shared";
import AuthenticationService from "../../src/models/AuthenticationService";

describe("NavbarPresenter", () => {
    let mockNavbarPresenterView: NavbarView;
    let navbarPresenterSpyInstance: NavbarPresenter;
    let mockService: AuthenticationService;

    const authToken = new AuthToken("tristanbrownishot", Date.now());

    beforeEach( () => {
        mockNavbarPresenterView = mock<NavbarView>();
        mockService = mock<AuthenticationService>();

        let mockNavbarPresenterViewInstance = instance(mockNavbarPresenterView);
        let mockServiceInstance = instance(mockService);
        
        let navbarPresenter = new NavbarPresenter(mockNavbarPresenterViewInstance);
        const navbarPresenterSpy = spy(navbarPresenter);
        navbarPresenterSpyInstance = instance(navbarPresenterSpy);

        when(navbarPresenterSpy.authService).thenReturn(mockServiceInstance);
    })

    it("tells the view to display a logging out message", async () => {
        await navbarPresenterSpyInstance.logout(authToken);
        verify(mockNavbarPresenterView.displayInfoMsg("Logging Out...", 0)).once()
    })

    it("calls logout on the user service with the correct auth token", async () => {
        await navbarPresenterSpyInstance.logout(authToken);
        verify(mockService.logUserOut(authToken)).once();
    })
})
