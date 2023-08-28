import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "./ImageSlider";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import "../assets/css/content.css";
import NoAvatar from "../assets/images/avatar.png";
import { SeedMessages } from "../data/Messages";

export default function Content({ chat, setChat }) {
  const [onMenu, setOnMenu] = useState(false);
  const [onMedia, setOnMedia] = useState(false);
  const [onViewer, setOnViewer] = useState(false);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(SeedMessages);
  const [medias, setMedias] = useState({
    images: [],
    audio: null,
  });

  const scrollRef = useRef();

  useEffect(() => {
    return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImages = (images) => {
    setImages(images);
    setOnViewer(true);
  };

  const handleCreateMessage = () => {
    if (!chat) return;
    if (!message && !medias?.audio && medias?.images.length === 0) return;

    const msg = {
      conversationId: "chatId",
      sender: "senderId",
      receiver: "receiverId",
      message,
      viewed: false,
      images: [],
      audio: null,
    };
    console.log("message added", msg, medias);
  };
  return (
    <div className={chat ? "content active" : "content"}>
      {chat ? (
        <div className="content-wrapper">
          <div className="content-top">
            <div className="avatar-infos">
              <div
                onClick={() => {
                  setChat(false);
                }}
                className="back-icon"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="avatar-wrapper">
                <img src={NoAvatar} alt="" className="avatar" />
                <span className="username">{"Marc"}</span>
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
            {images.length > 0 && onViewer ? (
              <div className="content-middle-images">
                <ImageSlider images={images} setOnViewer={setOnViewer} />
              </div>
            ) : (
              <div className="messages-wrapper">
                {messages.map((msg) => (
                  <Message
                    key={msg?.id}
                    msg={msg}
                    scrollRef={scrollRef}
                    owner={msg?.owner}
                    handleImages={handleImages}
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
}
