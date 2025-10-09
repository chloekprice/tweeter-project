import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { AuthenticationView } from "../../../presenters/Authentication/AuthenticationPresenter";
import LoginPresenter from "../../../presenters/Authentication/LoginPresenter";

interface Props {
  originalUrl?: string
  presenterFactory: (observer: AuthenticationView) => LoginPresenter
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { update } = useUserInfoActions();
  const { displayErrorMsg } = useMessageActions();

  const observer: AuthenticationView = {
      displayErrorMsg: displayErrorMsg,
      update: update
  }

  const presenterRef = useRef<LoginPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = props.presenterFactory(observer); }


  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key == "Enter" && !presenterRef.current!.checkSubmitButtonStatus(alias, password)) {
          doLogin();
      }
  };

  const doLogin = async () => {
      presenterRef.current!.doLogin(alias, password, rememberMe);
      if (!!props.originalUrl) {
          navigate(props.originalUrl);
      } else {
          navigate(`/feed/${alias}`);
      }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields onEnter={loginOnEnter} alias={alias} setAlias={setAlias} password={password} setPassword={setPassword} />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={presenterRef.current!.checkSubmitButtonStatus(alias, password).valueOf}
      isLoading={presenterRef.current!.isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
