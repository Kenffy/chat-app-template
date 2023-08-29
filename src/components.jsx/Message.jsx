import "../assets/css/message.css";
import { format } from "timeago.js";

export const Message = ({ owner, scrollRef, msg, handleImages }) => {
  return (
    <div className={owner ? "message owner" : "message"}>
      <div className="message-wrapper">
        {msg?.images.length > 0 && (
          <div
            className="image-wrapper"
            onClick={() => handleImages(msg.images)}
          >
            <img src={msg.images[0].url} alt="" />
            {msg?.images.length > 1 && (
              <div className="image-count">+{msg?.images.length - 1}</div>
            )}
          </div>
        )}
        {msg?.audio !== null && (
          <audio
            className="audio-player"
            src={msg?.audio?.url}
            controls
            controlsList="nodownload"
          />
        )}
        <p>{msg?.message}</p>
      </div>
      <span ref={scrollRef}>{format(msg?.createdAt?.toDate())}</span>
    </div>
  );
};
