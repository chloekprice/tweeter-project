import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import UserInfoProvider from "./views/userInfo/UserInfoProvider";
import ToastInfoProvider from "./views/toaster/ToastInfoProvider";
import ToastPresenter, { ToastView } from "./presenters/ToastPresenter";

library.add(fab);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <UserInfoProvider>
    <ToastInfoProvider presenterFactory={(view: ToastView) => new ToastPresenter(view)} >
      <App />
    </ToastInfoProvider>
  </UserInfoProvider>
);
