import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import StatusItem from "../statusItem/StatusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import StatusItemPresenter, { StatusItemView } from "../../presenters/StatusItem/StatusItemPresenter";

export const PAGE_SIZE = 10;


interface Props {
    itemDescription: String
    urlPath: string
    loadMore (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> 
    presenterFactory: (observer: StatusItemView) => StatusItemPresenter
}

const StatusItemScroller = (props: Props) => {
    const { displayErrorMsg } = useMessageActions();
    const [items, setItems] = useState<Status[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [lastItem, setLastItem] = useState<Status | null>(null);

    const addItems = (newItems: Status[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]);

    const userInfo  = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const observer: StatusItemView = {
        
    }

    const presenterRef = useRef<StatusItemPresenter | null>(null)
    if (!presenterRef.current) { presenterRef.current = props.presenterFactory(observer); }

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
        loadMoreItems(null);
    }, [userInfo.displayedUser]);

    const reset = async () => {
        setItems(() => []);
        setLastItem(() => null);
        setHasMoreItems(() => true);
    };

    const loadMoreItems = async (lastItem: Status | null) => {
        try {
            const [newItems, hasMore] = await props.loadMore(
                userInfo.authToken!,
                userInfo.displayedUser!.alias,
                PAGE_SIZE,
                lastItem
            );

            setHasMoreItems(() => hasMore);
            setLastItem(() => newItems[newItems.length - 1]);
            addItems(newItems);
        } catch (error) {
            displayErrorMsg(
              `Failed to load ${props.itemDescription} items because of exception: ${error}`,
            );
        }
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={() => loadMoreItems(lastItem)}
                hasMore={hasMoreItems}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                  <StatusItem status={item} index={index} pageUrl={props.urlPath} />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default StatusItemScroller;
