import { Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import StatusItem from "../statusItem/StatusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { ItemView } from "../../presenters/Items/ItemPresenter";
import StatusItemPresenter from "../../presenters/Items/StatusItem/StatusItemPresenter";


interface Props {
    urlPath: string
    presenterFactory: (observer: ItemView<Status>) => StatusItemPresenter
}

const StatusItemScroller = (props: Props) => {
    const { displayErrorMsg } = useMessageActions();
    const [items, setItems] = useState<Status[]>([]);

    const userInfo  = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const observer: ItemView<Status> = {
        addItems: (items: Status[]) => setItems((previousItems) => [...previousItems, ...items]),
        displayErrorMsg: displayErrorMsg
    }

    const presenterRef = useRef<StatusItemPresenter | null>(null)
    if (!presenterRef.current) { presenterRef.current = props.presenterFactory(observer); }

    useEffect(() => {
        if (userInfo.authToken && displayedUserAliasParam && displayedUserAliasParam != userInfo.displayedUser!.alias) {
            presenterRef.current!.getUser(userInfo.authToken, displayedUserAliasParam!)
            .then((toUser) => {
                if (toUser) { set(toUser); }
            });
        }
    }, [displayedUserAliasParam]);

    useEffect(() => {
        reset();
        loadMoreItems();
    }, [userInfo.displayedUser]);

    const reset = async () => {
        setItems(() => []);
        presenterRef.current!.reset();
    };

    const loadMoreItems = async () => {
        return presenterRef.current!.loadMoreItems(userInfo.authToken!, userInfo.displayedUser!.alias);
    };


    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={() => loadMoreItems()}
                hasMore={presenterRef.current.hasMoreItems}
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
