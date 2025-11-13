import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared";
import AuthenticationService from "../../services/AuthenticationService";

export const handler = async (request: AuthenticationRequest): Promise<AuthenticationResponse> => {
    if (!request.alias || !request.password) { throw new Error("Bad Request: the request does not include all required parameters") }

    const authService: AuthenticationService = new AuthenticationService();
    const [user, authToken] = await authService.login(request.alias, request.password);

    return {
        success: true,
        message: null, 
        user: user,
        authToken: authToken
    }
}
