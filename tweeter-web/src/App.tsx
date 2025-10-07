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
import UserItemScroller from "./views/mainLayout/UserItemScroller";
import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./views/mainLayout/StatusItemScroller";
import { useUserInfo } from "./views/userInfo/UserInfoHooks";
import FolloweePresenter from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import FollowerPresenter from "./presenters/FollowerPresenter";

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


  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };


  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${userInfo.displayedUser!.alias}`} />} />
        <Route 
          path="feed/:displayedUser" 
          element={<StatusItemScroller key={`/feed/${userInfo.displayedUser!.alias}`} itemDescription={"feed"} urlPath={"feed"} loadMore={loadMoreFeedItems} /> }
        />
        <Route 
          path="story/:displayedUser" 
          element={<StatusItemScroller key={`/story/${userInfo.displayedUser!.alias}`} itemDescription={"story"} urlPath={"story"} loadMore={loadMoreStoryItems} /> }
        />
        <Route 
          path="followees/:displayedUser" 
          element={ <UserItemScroller key={`followees-${userInfo.displayedUser!.alias}`} featureURL={"/followees"} presenterFactory={(view: UserItemView) => new FolloweePresenter(view)} /> } 
        />
        <Route
          path="followers/:displayedUser" 
          element={<UserItemScroller key={`followers-${userInfo.displayedUser!.alias}`} featureURL={"/followers"} presenterFactory={(view: UserItemView) => new FollowerPresenter(view)} /> }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${userInfo.displayedUser!.alias}`} />} />
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
