import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { useCallback, useRef } from "react";
import NavigatePresenter, { NavigateView } from "../../presenters/Navigation/NavigatePresenter";

interface NavigateToUserData {
    featurePath: String
}

function useNavigateToUser() {
    const navigate = useNavigate();
    const userInfo = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayErrorMsg } = useMessageActions();
    
    const observer: NavigateView = {
        displayErrorMsg: displayErrorMsg,
        setUser: set
    }

    const presenterRef = useRef<NavigatePresenter | null>(null)
    if (!presenterRef.current) { presenterRef.current = new NavigatePresenter(observer); }

    
    const navigateToUser = useCallback( async (event: React.MouseEvent, data: NavigateToUserData): Promise<void> => {
        event.preventDefault();
        const userAlias = await presenterRef.current!.navigateToUser(userInfo.authToken!, event.target.toString(), userInfo.displayedUser!);
        if (!!userAlias) { navigate(`${data.featurePath}/${userAlias}`); }
    }, []);

    return { navigateToUser }
}

export default useNavigateToUser;
