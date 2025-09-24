import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";

interface NavigateToUserData {
    featurePath: String
}


const navigate = useNavigate();

const navigateToUser = async (event: React.MouseEvent, data: NavigateToUserData): Promise<void> => {
    const userInfo = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayErrorMsg } = useMessageActions();


    event.preventDefault();

    try {
        const alias = extractAlias(event.target.toString());
        const toUser = await getUser(userInfo.authToken!, alias);

        if (toUser) {
            if (!toUser.equals(userInfo.displayedUser!)) {
                set(toUser);
                navigate(`${data.featurePath}/${toUser.alias}`);
            }
        }
    } catch (error) {
        displayErrorMsg(
        `Failed to get user because of exception: ${error}`,
        );
    }
};

const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
};

const getUser = async (
    authToken: AuthToken,
    alias: string
    ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
};


export const useNavigateToUser = (event: React.MouseEvent, data: NavigateToUserData): Promise<void> => {
    return navigateToUser(event, data);
}
