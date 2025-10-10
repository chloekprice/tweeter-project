import "./Toaster.css";
import { useEffect, useRef } from "react";
import { Toast } from "react-bootstrap";
import { useMessageActions, useMessageList } from "./MessageHooks";
import ToasterPresenter, { ToasterView } from "../../presenters/Toasts/ToasterPresenter";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const msgList = useMessageList();
  const { deleteMsg } = useMessageActions();

  const observer: ToasterView = {
    deleteMsg: deleteMsg
  }

  const presenterRef = useRef<ToasterPresenter | null>(null)
  if (!presenterRef.current) { presenterRef.current = new ToasterPresenter(observer); }

  useEffect(() => {
    const interval = setInterval(() => {
      if (msgList.length) {
        presenterRef.current!.deleteExpiredToasts(msgList);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgList]);

  return (
    <>
      <div className={`toaster-container ${position}`}>
        {msgList.map((msg, i) => (
          <Toast
            id={msg.id}
            key={i}
            className={msg.bootstrapClasses}
            autohide={false}
            show={true}
            onClose={() => deleteMsg(msg.id)}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{msg.title}</strong>
            </Toast.Header>
            <Toast.Body>{msg.text}</Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  );
};

export default Toaster;
