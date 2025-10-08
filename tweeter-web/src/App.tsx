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
import StatusItemScroller from "./views/mainLayout/StatusItemScroller";
import { useUserInfo } from "./views/userInfo/UserInfoHooks";
import FolloweePresenter from "./presenters/UserItem/FolloweePresenter";
import { UserItemView } from "./presenters/UserItem/UserItemPresenter";
import FollowerPresenter from "./presenters/UserItem/FollowerPresenter";
import FeedPresenter from "./presenters/StatusItem/FeedPresenter";
import { StatusItemView } from "./presenters/StatusItem/StatusItemPresenter";
import StoryPresenter from "./presenters/StatusItem/StoryPresenter";

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

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${userInfo.displayedUser!.alias}`} />} />
        <Route 
          path="feed/:displayedUser" 
          element={<StatusItemScroller key={`/feed/${userInfo.displayedUser!.alias}`} urlPath={"feed"} presenterFactory={(view: StatusItemView) => new FeedPresenter(view)} /> }
        />
        <Route 
          path="story/:displayedUser" 
          element={<StatusItemScroller key={`/story/${userInfo.displayedUser!.alias}`} urlPath={"story"} presenterFactory={(view: StatusItemView) => new StoryPresenter(view)} /> }
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
