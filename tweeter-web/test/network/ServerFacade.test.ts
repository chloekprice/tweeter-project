import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch"

describe('ServerFacade Integration Tests', () => {
    const serverFacade: ServerFacade = new ServerFacade();

    test('registers a new user successfully', async () => {
        const request = {
            alias: "@test",
            password: "password",
            firstName: "Test",
            lastName: "User",
            imageUrl: "image"
        }

        const response = await serverFacade.registerUser(request);

        expect(response[0]).toBeDefined();
        expect(response[1]).toBeDefined();
    })
})
