import { useState } from "react";
import "../assets/css/content.css";
import NoAvatar from "../assets/images/avatar.png";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";

export const Content = ({ chat, setChat }) => {
  const [onMenu, setOnMenu] = useState(false);
  const [onMedia, setOnMedia] = useState(false);
  const [message, setMessage] = useState("");
  const [medias, setMedias] = useState({
    images: [],
    audio: null,
    document: null,
  });

  const handleClick = () => {
    setChat(false);
    console.log(message, medias);
  };

  return (
    <div className={chat ? "content active" : "content"}>
      {chat ? (
        <div className="content-wrapper">
          <div className="content-top">
            <div className="avatar-infos">
              <div onClick={handleClick} className="back-icon">
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="avatar-wrapper">
                <img src={NoAvatar} alt="" className="avatar" />
                <span className="username">Max Well</span>
              </div>
            </div>

            <div
              className="menu"
              tabIndex={0}
              onBlur={() => setOnMenu(false)}
              onClick={() => setOnMenu((prev) => !prev)}
            >
              <i className="fa-solid fa-ellipsis"></i>
              {onMenu && (
                <div className="menu-wrapper">
                  <span className="menu-item" onClick={() => setChat(false)}>
                    Close Chat
                  </span>
                  <span className="menu-item">Delete Messages</span>
                  <span className="menu-item">Delete Chat</span>
                </div>
              )}
            </div>
          </div>

          <div className="content-middle">
            <div className="messages-wrapper">
              <Message />
              <Message owner={true} />
              <Message />
              <Message />
              <Message owner={true} />
              <Message />
              <Message owner={true} />
              <Message />
              <Message owner={true} />
              <Message />
              <Message />
              <Message owner={true} />
              <Message />
              <Message />
              <Message />
              <Message owner={true} />
              <Message />
              <Message />
            </div>
          </div>
          <div className="content-bottom">
            <ChatInput
              onMedia={onMedia}
              setOnMedia={setOnMedia}
              medias={medias}
              setMedias={setMedias}
              message={message}
              setMessage={setMessage}
            />
          </div>
        </div>
      ) : (
        <div className="infos-wrapper">
          <div className="infos">
            <i className="fa-solid fa-comments"></i>
            <h2>Chat App</h2>
            <p>Select a user to start a conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};
