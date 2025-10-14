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
import { Status, User } from "tweeter-shared";
import { ItemView } from "./presenters/Items/ItemPresenter";
import FeedPresenter from "./presenters/Items/StatusItem/FeedPresenter";
import StoryPresenter from "./presenters/Items/StatusItem/StoryPresenter";
import FolloweePresenter from "./presenters/Items/UserItem/FolloweePresenter";
import FollowerPresenter from "./presenters/Items/UserItem/FollowerPresenter";


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
          element={<StatusItemScroller key={`/feed/${userInfo.displayedUser!.alias}`} urlPath={"feed"} presenterFactory={(view: ItemView<Status>) => new FeedPresenter(view)} /> }
        />
        <Route 
          path="story/:displayedUser" 
          element={<StatusItemScroller key={`/story/${userInfo.displayedUser!.alias}`} urlPath={"story"} presenterFactory={(view: ItemView<Status>) => new StoryPresenter(view)} /> }
        />
        <Route 
          path="followees/:displayedUser" 
          element={ <UserItemScroller key={`/followees/${userInfo.displayedUser!.alias}`} featureURL={"/followees"} presenterFactory={(view: ItemView<User>) => new FolloweePresenter(view)} /> } 
        />
        <Route
          path="followers/:displayedUser" 
          element={<UserItemScroller key={`/followers/${userInfo.displayedUser!.alias}`} featureURL={"/followers"} presenterFactory={(view: ItemView<User>) => new FollowerPresenter(view)} /> }
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
