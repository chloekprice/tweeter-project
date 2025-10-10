import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import UserInfoPresenter, { UserInfoView } from "../../presenters/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMsg, displayErrorMsg, deleteMsg } = useMessageActions();

  const userInfo = useUserInfo();
  const { set } = useUserInfoActions();
  const navigate = useNavigate();

  const observer: UserInfoView = {
      deleteMsg: deleteMsg,
      displayErrorMsg: displayErrorMsg,
      displayInfoMsg: displayInfoMsg,
      setUser: set,
      navigate: navigate,
      setIsFollower: setIsFollower,
      setIsLoading: setIsLoading,
      setFolloweeCount: setFolloweeCount,
      setFollowerCount: setFollowerCount,
  }

  const presenterRef = useRef<UserInfoPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = new UserInfoPresenter(observer); }

  if (!userInfo.displayedUser) {
    set(userInfo.currentUser!);
  }

  useEffect(() => {
    presenterRef.current!.intializeUserInfo(userInfo.authToken!, userInfo.currentUser!, userInfo.displayedUser!);
  }, [userInfo.displayedUser]);


  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    presenterRef.current!.switchToLoggedInUser(userInfo.currentUser!);
  };

  const followDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    await presenterRef.current!.followDisplayedUser(userInfo.displayedUser!, userInfo.authToken!);
  };

  const unfollowDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    await presenterRef.current!.unfollowDisplayedUser(userInfo.displayedUser!, userInfo.authToken!);
  };

  return (
    <>
      {userInfo.currentUser === null || userInfo.displayedUser === null || userInfo.authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={userInfo.displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!userInfo.displayedUser.equals(userInfo.currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${userInfo.currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{userInfo.displayedUser.name}</b>
              </h2>
              <h3>{userInfo.displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!userInfo.displayedUser.equals(userInfo.currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
