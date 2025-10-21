import "./PostStatus.css";
import { useRef, useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import PostPresenter, { PostView } from "../../presenters/PostPresenter";


interface Props {
  presenter?: PostPresenter
}

const PostStatus = (props: Props) => {
  const { displayInfoMsg, displayErrorMsg, deleteMsg } = useMessageActions();

  const userInfo = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const observer: PostView = {
    deleteMsg: deleteMsg,
    displayErrorMsg: displayErrorMsg,
    displayInfoMsg: displayInfoMsg,         
    setIsLoading: setIsLoading,
    setPost: setPost
  }

  const presenterRef = useRef<PostPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = props.presenter ?? new PostPresenter(observer); }

  const submitPost = async (event: React.MouseEvent) => {
    await presenterRef.current!.submitPost(post, userInfo.currentUser!, userInfo.authToken!);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !userInfo.authToken || !userInfo.currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          aria-label="status-content"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          aria-label="post"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          aria-label="clear"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
