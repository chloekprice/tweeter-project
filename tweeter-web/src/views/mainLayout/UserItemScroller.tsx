import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import UserItemPresenter, { UserItemView } from "../../presenters/UserItemPresenter";

interface Props {
    featureURL: string
    presenterFactory: (observer: UserItemView) => UserItemPresenter
}


const UserItemScroller = (props: Props) => {
    const { displayErrorMsg } = useMessageActions();
    const [items, setItems] = useState<User[]>([]);

    const userInfo = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const observer: UserItemView = {
        addItems: (items: User[]) => setItems((previousItems) => [...previousItems, ...items]),
        displayErrorMsg: displayErrorMsg
    }

    const presenter = props.presenterFactory(observer);

    useEffect(() => {
        if (
            userInfo.authToken &&
            displayedUserAliasParam &&
            displayedUserAliasParam != userInfo.displayedUser!.alias
        ) {
            getUser(userInfo.authToken!, displayedUserAliasParam!).then((toUser) => {
            if (toUser) {
                set(toUser);
            }
            });
        }
    }, [displayedUserAliasParam]);

    useEffect(() => {
        reset();
        loadMoreItems();
    }, [userInfo.displayedUser]);

    const reset = async () => {
        setItems(() => []);
        presenter.reset();
    };

    const loadMoreItems = async () => {
        return presenter.loadMoreItems(userInfo.authToken!, userInfo.displayedUser!.alias);
    };

    const getUser = async (authToken: AuthToken, alias: string): Promise<User | null> => {
        return presenter.getUser(authToken, alias);
    };


    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={() => loadMoreItems()}
            hasMore={presenter.hasMoreItems}
            loader={<h4>Loading...</h4>}
            >
            {items.map((item, index) => (
                <div
                key={index}
                className="row mb-3 mx-0 px-0 border rounded bg-white"
                >
                <UserItem user={item} featurePath={props.featureURL} />
                </div>
            ))}
            </InfiniteScroll>
        </div>
    );
}

export default UserItemScroller;
