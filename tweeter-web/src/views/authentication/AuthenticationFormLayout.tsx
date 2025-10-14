import OAuth from "./OAuth";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
  headingText: string;
  submitButtonLabel: string;
  oAuthHeading: string;
  inputFieldFactory: () => JSX.Element;
  switchAuthenticationMethodFactory: () => JSX.Element;
  setRememberMe: (value: boolean) => void;
  submitButtonDisabled: () => boolean;
  isLoading: boolean;
  submit: () => void;
}

const AuthenticationFormLayout = (props: Props) => {
  const { displayInfoMsg } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMsg(message, 3000, "text-white bg-primary");
  };

  return (
    <div className="center">
      <div className="form-main w-100 m-auto rounded">
        <form>
          <img
            className="mb-4"
            src="/bird-logo-64.png"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 fw-normal">{props.headingText}</h1>

          {props.inputFieldFactory()}

          <h1 className="h4 mb-3 fw-normal">Or</h1>
          <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>

          <div className="text-center mb-3">
            <OAuth authMethod={"Google"} icon={["fab", "google"]} tooltipId={"googleTooltip"} infoMessage={"Google registration is not implemented."} displayInfo={displayInfoMessageWithDarkBackground} />
            <OAuth authMethod={"Facebook"} icon={["fab", "facebook"]} tooltipId={"facebookTooltip"} infoMessage={"Facebook registration is not implemented."} displayInfo={displayInfoMessageWithDarkBackground} />
            <OAuth authMethod={"Twitter"} icon={["fab", "twitter"]} tooltipId={"twitterTooltip"} infoMessage={"Twitter registration is not implemented."} displayInfo={displayInfoMessageWithDarkBackground} />
            <OAuth authMethod={"LinkedIn"} icon={["fab", "linkedin"]} tooltipId={"linkedinTooltip"} infoMessage={"LinkedIn registration is not implemented."} displayInfo={displayInfoMessageWithDarkBackground} />
            <OAuth authMethod={"GitHub"} icon={["fab", "github"]} tooltipId={"githubTooltip"} infoMessage={"GitHub registration is not implemented."} displayInfo={displayInfoMessageWithDarkBackground} />
          </div>

          <div className="checkbox mb-3">
            <label>
              <input
                type="checkbox"
                value="remember-me"
                onChange={(event) => props.setRememberMe(event.target.checked)}
              />{" "}
              Remember me
            </label>
          </div>

          {props.switchAuthenticationMethodFactory()}

          <button
            id="submitButton"
            className="w-100 btn btn-lg btn-primary"
            type="button"
            disabled={props.submitButtonDisabled()}
            onClick={() => props.submit()}
          >
            {props.isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>{props.submitButtonLabel}</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationFormLayout;
