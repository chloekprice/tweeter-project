import { AuthToken, PagedItemRequest, RegisterRequest, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch"

describe('ServerFacade Integration Tests', () => {
    const serverFacade: ServerFacade = new ServerFacade();

    test('successfully registers a new user', async () => {
        const request = {
            alias: "@test",
            password: "password",
            firstName: "Test",
            lastName: "User",
            imageUrl: "image"
        }

        const [user, token] = await serverFacade.registerUser(request);

        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(User);
        expect(token).toBeDefined();
        expect(token).toBeInstanceOf(AuthToken);
    })

    test('unsuccessfully registers a new user when missing a body parameter', async () => {
        const invalidRequest = {
            alias: "@test",
            password: "password",
            firstName: "Test",
            lastName: "User"
        } as unknown as RegisterRequest;

        await expect(serverFacade.registerUser(invalidRequest)).rejects.toThrow(/Bad Request: the request does not include all required parameters/i);

    })

    test("successfully gets a user's followers", async () => {
        const request = {
            token: "auth token",
            userAlias: "@test",
            pageSize: 10,
            lastItem: null
        }

        const [followers, hasMore] = await serverFacade.getMoreItems<UserDto, User>(request, User, "/follower/list/load");

        expect(followers).toBeDefined();
        expect(followers).toBeInstanceOf(Array);
        expect(hasMore).toBeDefined();
        expect(typeof hasMore).toBe("boolean");
    })

    test("unsuccessfully gets a user's followers with invalid auth token", async () => {
        const unauthorizedRequest = {
            token: 2,
            userAlias: "@test",
            pageSize: 10,
            lastItem: null
        } as unknown as PagedItemRequest<UserDto>;

        await expect(
            serverFacade.getMoreItems<UserDto, User>(unauthorizedRequest, User, "/follower/list/load")
        ).rejects.toThrow(/Unauthorized: there are insufficient permissions to perform this action/);
    })

    test("successfully gets the number of users that a particular user follows", async () => {
        const request = {
            token: "auth token",
            userAlias: "@test",
        }

        const count = await serverFacade.getUserItemCount(request, "followee");

        expect(count).toBeDefined();
        expect(typeof count).toBe("number");
    })

    test("unsuccessfully gets the number of users that a particular user follows when endpoint is wrong", async () => {
        const request = {
            token: "auth token",
            userAlias: "@test",
        }

        await expect(
            serverFacade.getUserItemCount(request, "invalid")
        ).rejects.toThrow(/Client communicator POST failed/);
    })
})
