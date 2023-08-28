import "../assets/css/message.css";

export const Message = ({ owner, scrollRef, msg, handleImages }) => {
  return (
    <div className={owner ? "message owner" : "message"}>
      <div className="message-wrapper">
        {msg?.images.length > 0 && (
          <div
            className="image-wrapper"
            onClick={() => handleImages(msg.images)}
          >
            <img src={msg.images[0]} alt="" />
            {msg?.images.length > 1 && (
              <div className="image-count">+{msg?.images.length - 1}</div>
            )}
          </div>
        )}
        {msg?.audio !== null && (
          <audio className="audio-player" src={msg?.audio} controls />
        )}
        <p>{msg?.message}</p>
      </div>
      <span ref={scrollRef}>just now</span>
    </div>
  );
};
