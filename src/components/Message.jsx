import { format } from "timeago.js";
import "../assets/css/message.css";
import { AudioPlayer } from "./AudioPlayer";

export const Message = ({ owner, scrollRef, msg, handleMessageImages }) => {
  return (
    <div ref={scrollRef} className={owner ? "message owner" : "message"}>
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
