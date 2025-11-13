import { AuthenticationResponse, RegisterRequest } from "tweeter-shared";
import AuthenticationService from "../../services/AuthenticationService";

export const handler = async (request: RegisterRequest): Promise<AuthenticationResponse> => {
    if (!request.alias || !request.password || !request.firstName || !request.lastName || !request.imageUrl)  { 
        throw new Error("Bad Request: the request does not include all required parameters") 
    }

    const authService: AuthenticationService = new AuthenticationService();
    const [user, authToken] = await authService.register(request.firstName, request.lastName, request.alias, request.password, request.imageUrl);

    return {
        success: true,
        message: null, 
        user: user,
        authToken: authToken
    }
}
