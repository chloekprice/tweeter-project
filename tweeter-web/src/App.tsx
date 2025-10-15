import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./views/authentication/login/Login";
import Register from "./views/authentication/register/Register";
import MainLayout from "./views/mainLayout/MainLayout";
import Toaster from "./views/toaster/Toaster";
import { useUserInfo } from "./views/userInfo/UserInfoHooks";
import { Status, User } from "tweeter-shared";
import { ItemView } from "./presenters/Items/ItemPresenter";
import FeedPresenter from "./presenters/Items/StatusItem/FeedPresenter";
import StoryPresenter from "./presenters/Items/StatusItem/StoryPresenter";
import FolloweePresenter from "./presenters/Items/UserItem/FolloweePresenter";
import FollowerPresenter from "./presenters/Items/UserItem/FollowerPresenter";
import ItemScroller from "./views/mainLayout/ItemScroller";
import StatusItemPresenter from "./presenters/Items/StatusItem/StatusItemPresenter";
import StatusService from "./models/StatusService";
import StatusItem from "./views/statusItem/StatusItem";
import UserItem from "./views/userItem/UserItem";
import UserItemPresenter from "./presenters/Items/UserItem/UserItemPresenter";
import FollowService from "./models/FollowService";


const App = () => {
  const userInfo = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!userInfo.currentUser && !!userInfo.authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const userInfo = useUserInfo();

  
  const statusItemComponent = (item: Status, index: number, pageUrl: string): JSX.Element => {
    return <StatusItem status={item} index={index} pageUrl={pageUrl}/>
  }

  const userItemComponent = (item: User, index: number, pageUrl: string): JSX.Element => {
    return <UserItem user={item} featurePath={pageUrl}/>
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${userInfo.displayedUser!.alias}`} />} />
        <Route 
          path="feed/:displayedUser" 
          element={<ItemScroller<Status, StatusService, StatusItemPresenter> key={`/feed/${userInfo.displayedUser!.alias}`} urlPath={"feed"} presenterFactory={(view: ItemView<Status>) => new FeedPresenter(view)} itemComponent={statusItemComponent} /> }
        />
        <Route 
          path="story/:displayedUser" 
          element={<ItemScroller<Status, StatusService, StatusItemPresenter> key={`/story/${userInfo.displayedUser!.alias}`} urlPath={"story"} presenterFactory={(view: ItemView<Status>) => new StoryPresenter(view)} itemComponent={statusItemComponent} /> }
        />
        <Route 
          path="followees/:displayedUser" 
          element={<ItemScroller<User, FollowService, UserItemPresenter> key={`/followees/${userInfo.displayedUser!.alias}`} urlPath={"/followees"} presenterFactory={(view: ItemView<User>) => new FolloweePresenter(view)} itemComponent={userItemComponent} /> }
        />
        <Route
          path="followers/:displayedUser"
          element={<ItemScroller<User, FollowService, UserItemPresenter> key={`/followers/${userInfo.displayedUser!.alias}`} urlPath={"/followers"} presenterFactory={(view: ItemView<User>) => new FollowerPresenter(view)} itemComponent={userItemComponent} /> } 
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route 
          path="*" 
          element={<Navigate to={`/feed/${userInfo.displayedUser!.alias}`} />} 
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
