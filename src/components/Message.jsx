import { format } from "timeago.js";
import "../assets/css/message.css";
import { AudioPlayer } from "./AudioPlayer";
import { useEffect, useRef } from "react";

export const Message = ({ owner, isLastMessage, msg, handleMessageImages }) => {
  const scrollRef = useRef();
  useEffect(() => {
    return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div
      ref={isLastMessage ? scrollRef : null}
      className={owner ? "message owner" : "message"}
    >
      <div className="message-wrapper">
        {msg?.images.length > 0 && (
          <div
            className="image-wrapper"
            onClick={() => handleMessageImages(msg.images)}
          >
            <img src={msg.images[0].url} alt="" />
            {msg?.images.length > 1 && (
              <div className="image-count">+{msg?.images.length - 1}</div>
            )}
          </div>
        )}
        {msg?.audio && <AudioPlayer audio={msg?.audio} />}
        <p>{msg?.message}</p>
      </div>
      <span>{format(msg?.createdAt?.toDate())}</span>
    </div>
  );
};
