import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "./ImageSlider";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import "../assets/css/content.css";
import NoProfile from "../assets/images/noprofile.png";
//import { SeedMessages } from "../data/Messages";
import {
  createMessageAsync,
  getMsgQueryByConversationId,
  getSnapshotData,
} from "../services/chatServices";
import { onSnapshot } from "firebase/firestore";

export default function Content({
  user,
  chat,
  setCurrChat,
  setChats,
  setFilteredChats,
}) {
  const [onMenu, setOnMenu] = useState(false);
  const [onMedia, setOnMedia] = useState(false);
  const [onViewer, setOnViewer] = useState(false);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [medias, setMedias] = useState({
    images: [],
    audio: null,
  });

  const scrollRef = useRef();

  const friendProfile = chat?.friend?.profile
    ? chat.friend.profile.url
    : NoProfile;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const q = getMsgQueryByConversationId(chat.id);
        onSnapshot(q, (querySnapshot) => {
          let tmpMessages = [];
          querySnapshot.forEach((doc) => {
            tmpMessages.push(getSnapshotData(doc));
          });
          setMessages(tmpMessages);
        });
      } catch (error) {
        console.log(error);
      }
    };
    chat && loadMessages();
  }, [chat]);

  useEffect(() => {
    return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImages = (images) => {
    setImages(images);
    setOnViewer(true);
  };

  const handleCreateMessage = async () => {
    if (!chat) return;
    if (!message && !medias?.audio && medias?.images.length === 0) return;

    try {
      const msg = {
        conversationId: chat?.id,
        sender: user.id,
        receiver: chat?.friend?.id,
        message,
        viewed: false,
        images: [],
        audio: null,
      };

      const res = await createMessageAsync(msg, medias);
      setMessage("");
      setMedias((prev) => ({
        ...prev,
        images: [],
        audio: null,
      }));
      if (res) {
        const currChat = {
          ...chat,
          last: { message: res.message, createdAt: res.createdAt },
        };
        setCurrChat(currChat);
        setChats((prev) => [
          ...prev.map((c) => (c.id === currChat.id ? currChat : c)),
        ]);
        setFilteredChats((prev) => [
          ...prev.map((c) => (c.id === currChat.id ? currChat : c)),
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={chat ? "content active" : "content"}>
      {chat ? (
        <div className="content-wrapper">
          <div className="content-top">
            <div className="avatar-infos">
              <div onClick={() => setCurrChat(null)} className="back-icon">
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="avatar-wrapper">
                <img src={friendProfile} alt="" className="avatar" />
                <span className="username">{chat?.friend?.username}</span>
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
                  <span className="menu-item" onClick={() => setCurrChat(null)}>
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
                    owner={msg?.sender === user?.id}
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
