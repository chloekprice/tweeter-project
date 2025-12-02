import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared";
import AuthenticationService from "../../services/AuthenticationService";
import { DynamoDatabaseFactory } from "../../daos/AmazonDatabaseFactory";

let databaseProvider: DynamoDatabaseFactory;
let authService: AuthenticationService;

export const handler = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    if (!request.alias || !request.password) { throw new Error("Bad Request: the request does not include all required parameters") }

    if (!databaseProvider) {
        databaseProvider = new DynamoDatabaseFactory();
        authService = new AuthenticationService(databaseProvider);
    }

    const [user, authToken] = await authService.login(request.alias, request.password);

    return {
        success: true,
        message: null, 
        user: user,
        authToken: authToken
    }
}
