import { useCallback, useMemo, useRef, useState } from "react";
import ToastPresenter, { ToastView } from "../../presenters/ToastPresenter";
import PropTypes from "prop-types";
import { ToastListContext, ToastActionsContext } from "./ToastContexts";
import { Toast, ToastType } from "./Toast";

interface Props {
  children: React.ReactNode;
  presenterFactory: (observer: ToastView) => ToastPresenter
}

const ToastInfoProvider = (props: Props) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const displayExistingToast = useCallback((toast: Toast) => {
    setToastList((previousList) => [...previousList, toast]);
  }, []);

  const observer: ToastView = {
    displayExistingToast: displayExistingToast,
    setToastList: setToastList
  }

  const presenterRef = useRef<ToastPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = props.presenterFactory(observer); }
  

  const displayToast = useCallback(
    (
      toastType: ToastType,
      message: string,
      duration: number,
      title?: string,
      bootstrapClasses?: string
    ): string => {
      return presenterRef.current!.displayToast(toastType, message, duration, title, bootstrapClasses);
    },
    [displayExistingToast]
  );

  const deleteToast = useCallback((id: string) => {
    presenterRef.current!.deleteToast(id, toastList);
  }, []);

  const deleteAllToasts = useCallback(() => {
    presenterRef.current!.deleteAllToasts();
  }, []);

  const toastActions = useMemo(
    () => ({
      displayExistingToast,
      displayToast,
      deleteToast,
      deleteAllToasts,
    }),
    [displayExistingToast, displayToast, deleteToast, deleteAllToasts]
  );

  return (
    <ToastListContext.Provider value={toastList}>
      <ToastActionsContext.Provider value={toastActions}>
        {props.children}
      </ToastActionsContext.Provider>
    </ToastListContext.Provider>
  );
};

ToastInfoProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastInfoProvider;
