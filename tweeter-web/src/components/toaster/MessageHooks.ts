import { useContext } from "react";
import { ToastActionsContext, ToastListContext } from "./ToastContexts"
import { ToastType } from "./Toast";

interface MessageActions {
    displayInfoMsg: (
        message: string,
        duration: number,
        bootstrapClasses?: string,
    ) => string,
    displayErrorMsg: (
        message: string,
        bootstrapClasses?: string,
    ) => string,
    deleteMsg: (_toast: string) => void,
    deleteAllMsgs: () => void,
}

export const useMessageActions = (): MessageActions => {
    const {displayToast, deleteToast, deleteAllToasts} = useContext(ToastActionsContext);
    
    return {
        displayInfoMsg: (message: string, duration: number, bootstrapClasses?: string) => displayToast(ToastType.Info, message, duration, undefined, bootstrapClasses),
        displayErrorMsg: (message: string, bootstrapClasses?: string) => displayToast(ToastType.Error, message, 0, undefined, bootstrapClasses),
        deleteMsg: deleteToast,
        deleteAllMsgs: deleteAllToasts
    }
}


export const useMessageList = () => {
    return useContext(ToastListContext);
}
