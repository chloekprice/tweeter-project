import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { User, AuthToken } from "tweeter-shared";
import { UserInfo } from "./UserInfo";


interface UserInfoActions {
  update: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void,
  clear: () => void,
  set: (user: User) => void,
}

export const useUserInfoActions = (): UserInfoActions => {
    const {updateUserInfo, clearUserInfo, setDisplayedUser} = useContext(UserInfoActionsContext);

    return {
        update: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => updateUserInfo(currentUser, displayedUser, authToken, remember),
        clear: () => clearUserInfo(),
        set: (user: User) => setDisplayedUser(user)
    };
}

export const useUserInfo = (): UserInfo => {
    return useContext(UserInfoContext);
}
