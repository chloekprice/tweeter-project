import { Status, User } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import ItemPresenter, { ItemView } from "../../presenters/Items/ItemPresenter";
import { Service } from "../../models/Service";


interface Props<T extends Status | User, S extends Service,  P extends ItemPresenter<T, S>> {
    urlPath: string
    presenterFactory: (observer: ItemView<T>) => P
    itemComponent: (item: T, index: number, pageUrl: string) => JSX.Element
}

const ItemScroller = <
    T extends Status | User, 
    S extends Service, 
    P extends ItemPresenter<T, S>
> (props: Props<T, S, P>) => {
    const { displayErrorMsg } = useMessageActions();
    const [items, setItems] = useState<T[]>([]);

    const userInfo  = useUserInfo();
    const { set } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const observer: ItemView<T> = {
        addItems: (items: T[]) => setItems((previousItems) => [...previousItems, ...items]),
        displayErrorMsg: displayErrorMsg
    }

    const presenterRef = useRef<P | null>(null)
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
                    props.itemComponent(item, index, props.urlPath)
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default ItemScroller;
