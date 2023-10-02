import { useState } from "react";
import "../assets/css/content.css";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import ImageSlider from "./ImageSlider";
import { useConversations } from "../context/ConversationProvider";
import Avatar from "./Avatar";
import { useContacts } from "../context/ContactProvider";

export const Content = ({ onChat, setOnChat }) => {
  const { user } = useContacts();
  const { currentChat, messages, sendMessage, closeConversation } =
    useConversations();
  const [onMenu, setOnMenu] = useState(false);
  const [onMedia, setOnMedia] = useState(false);
  const [onViewer, setOnViewer] = useState(false);
  const [message, setMessage] = useState("");
  const [messageImages, setMessageImages] = useState([]);
  const [medias, setMedias] = useState({
    images: [],
    audio: null,
    document: null,
  });

  const friend = currentChat?.friend;
  const friendId = currentChat?.members.find((id) => id !== user?.uid);

  const handleMessageImages = (images) => {
    setMessageImages(images);
    setOnViewer(true);
  };

  const handleCreateMessage = async () => {
    if (!currentChat) return;
    if (!message && !medias?.audio && medias?.images.length === 0) return;

    try {
      const msg = {
        conversationId: currentChat?.id,
        sender: user.uid,
        receiver: friendId,
        message,
        viewed: false,
        images: [],
        audio: null,
        document: null,
      };

      const success = sendMessage(msg, medias);
      if (success) {
        setMessage("");
        setMedias((prev) => ({
          ...prev,
          images: [],
          audio: null,
          document: null,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={currentChat ? "content active" : "content"}>
      {currentChat ? (
        <div className="content-wrapper">
          <div className="content-top">
            <div className="avatar-infos">
              <div
                onClick={() => {
                  closeConversation(null);
                  setOnChat(false);
                }}
                className="back-icon"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="avatar-wrapper">
                <Avatar
                  height={35}
                  width={35}
                  src={friend?.profile ? friend.profile : ""}
                  alt=""
                  className="avatar"
                />
                <span className="username">{friend?.username}</span>
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
                  <span
                    className="menu-item"
                    onClick={() => closeConversation(null)}
                  >
                    Close Chat
                  </span>
                  <span className="menu-item">Delete Messages</span>
                  <span className="menu-item">Delete Chat</span>
                </div>
              )}
            </div>
          </div>

          <div className="content-middle">
            {messageImages.length > 0 && onViewer ? (
              <div className="content-middle-images">
                <ImageSlider images={messageImages} setOnViewer={setOnViewer} />
              </div>
            ) : (
              <div className="messages-wrapper">
                {messages.map((msg, index) => (
                  <Message
                    key={msg?.id}
                    msg={msg}
                    isLastMessage={messages.length - 1 == index}
                    owner={msg?.sender === user?.uid}
                    handleMessageImages={handleMessageImages}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="content-bottom">
            <ChatInput
              onMedia={onMedia}
              setOnMedia={setOnMedia}
              medias={medias}
              setMedias={setMedias}
              message={message}
              setMessage={setMessage}
              handleCreate={handleCreateMessage}
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
