import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { useCallback, useRef } from "react";
import NavigatePresenter, { NavigateView } from "../../presenters/Navigation/NavigatePresenter";

interface NavigateToUserData {
    featurePath: String
}

function useNavigateToUser() {
    const navigate = useNavigate();
    
    const navigateToUser = useCallback( async (event: React.MouseEvent, data: NavigateToUserData): Promise<void> => {
        const userInfo = useUserInfo();
        const { set } = useUserInfoActions();
        const { displayErrorMsg } = useMessageActions();

        const observer: NavigateView = {
              displayErrorMsg: displayErrorMsg
          }
        
        const presenterRef = useRef<NavigatePresenter | null>(null)
        if (!presenterRef.current) { presenterRef.current = new NavigatePresenter(observer); }

        event.preventDefault();

        try {
            const toUser = await presenterRef.current!.getUser(userInfo.authToken!, event.target.toString());

            if (toUser) {
                if (!toUser.equals(userInfo.displayedUser!)) {
                    set(toUser);
                    navigate(`${data.featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            displayErrorMsg(`Failed to get user because of exception: ${error}`);
        }
    }, []);

    return { navigateToUser }
}


export default useNavigateToUser;
