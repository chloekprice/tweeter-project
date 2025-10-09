import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import RegisterPresenter from "../../../presenters/Authentication/RegisterPresenter";
import { AuthenticationView } from "../../../presenters/Authentication/AuthenticationPresenter";


interface Props {
  presenterFactory: (observer: AuthenticationView) => RegisterPresenter
}

const Register = (props: Props) => {
  const navigate = useNavigate();
  const { update } = useUserInfoActions();
  const { displayErrorMsg } = useMessageActions();

  const observer: AuthenticationView = {
      displayErrorMsg: displayErrorMsg,
      update: update
  }

  const presenterRef = useRef<RegisterPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = props.presenterFactory(observer); }

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !presenterRef.current!.checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenterRef.current!.handleImageFile(file);
  };

  const doRegister = async () => {
      presenterRef.current!.doRegister();
      navigate(`/feed/${presenterRef.current!.alias}`);
  };

  
  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenterRef.current!.setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenterRef.current!.setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields onEnter={registerOnEnter} alias={presenterRef.current!.alias} setAlias={presenterRef.current!.setAlias} password={presenterRef.current!.password} setPassword={presenterRef.current!.setPassword} />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          {presenterRef.current!.imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={presenterRef.current!.imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={presenterRef.current!.setRememberMe}
      submitButtonDisabled={presenterRef.current!.checkSubmitButtonStatus}
      isLoading={presenterRef.current!.isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
