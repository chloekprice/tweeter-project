import { AuthToken, Status } from "tweeter-shared";
import StatusService from "../../src/models/StatusService";
import "isomorphic-fetch"

describe('StatusService Integration Tests', () => {
    const statusService: StatusService = new StatusService();

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});


    test("successfully retrieves a user's story", async () => {
        const authToken = new AuthToken("token", 12);

        const [statuses, hasMore] = await statusService.loadMoreStoryStatuses(authToken, "@bob", 10, null)

        expect(statuses).toBeDefined();
        expect(statuses).toBeInstanceOf(Array);
        expect(statuses[0]).toBeInstanceOf(Status);
        expect(hasMore).toBeDefined();
        expect(typeof hasMore).toBe("boolean");
    })

})
