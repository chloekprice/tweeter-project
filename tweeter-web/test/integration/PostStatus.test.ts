import PostPresenter, { PostView } from "../../src/presenters/PostPresenter";
import { AuthToken, Status, StatusDto, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch"

describe("Post Status Flow", () => {
    jest.setTimeout(30000);

    const testUserAlias = '@testuser';
    const testPassword = 'password123';
    const testMessage = "this is a test";

    let testUser: User;
    let testAuthToken: AuthToken;

    const mockedView: PostView = {
        setIsLoading: jest.fn(),
        setPost: jest.fn(),
        deleteMsg: jest.fn(),
        displayErrorMsg: jest.fn(),
        displayInfoMsg: jest.fn()
    };

    let presenter: PostPresenter;
    let server: ServerFacade;

    beforeAll(async () => {
        server = new ServerFacade();
        presenter = new PostPresenter(mockedView);
    });

    afterAll(async () => {
        await server.logoutUser({
            token: testAuthToken.token,
            userAlias: testUserAlias
        });
    });

    it("logs in user", async () => {
        try {
            const [user, token] = await server.loginUser({ alias: testUserAlias, password: testPassword });
            testUser = user;
            testAuthToken = token;
        } catch {
            const imageBytes = await getBase64ImageFromUrl("https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");

            const [user, token] = await server.registerUser({
                firstName: "Test",
                lastName: "User",
                alias: testUserAlias,
                password: testPassword,
                imageUrl: imageBytes
            });

            testUser = user;
            testAuthToken = token;
        }

        expect(testUser).toBeDefined();
        expect(testAuthToken).toBeDefined();
    });

    it("posts a status from logged in user", async () => {
        await presenter.submitPost(testMessage, testUser, testAuthToken);
        expect(mockedView.displayInfoMsg).toHaveBeenCalledTimes(2);
        expect(mockedView.displayInfoMsg).toHaveBeenCalledWith("Status posted!", expect.anything());
    });

    it("adds the post to the user's story", async () => {
        const [storyItems, _] = await server.getMoreItems<StatusDto, Status>(
            {token: testAuthToken.token, userAlias: testUserAlias, pageSize: 10, lastItem: null}, 
            Status, 
            "/status/story"
        );

        expect(storyItems.length).toBeGreaterThan(0);
        expect(storyItems[0].post).toBe(testMessage);
        expect(storyItems[0].user.alias).toBe(testUserAlias);
    });
});


async function getBase64ImageFromUrl(url: string): Promise<string> {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
}
