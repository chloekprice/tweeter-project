import { AuthToken, User } from "tweeter-shared";
import { UserInfo } from "../../views/userInfo/UserInfo";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

class UserDataPresenter {

    public constructor() { }

    public saveToLocalStorage(currentUser: User, authToken: AuthToken): void {
        localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
        localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
    };
    
    public retrieveFromLocalStorage(): UserInfo {
        const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
        const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));
    
        if (!!loggedInUser && !!authToken) {
          return { currentUser: loggedInUser, displayedUser: loggedInUser, authToken: authToken};
        } else {
          return { currentUser: null, displayedUser: null, authToken: null };
        }
    };
    
    public clearLocalStorage(): void {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    };

}

export default UserDataPresenter;