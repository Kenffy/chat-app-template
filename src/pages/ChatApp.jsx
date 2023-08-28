import "../assets/css/chatapp.css";
import Content from "../components.jsx/Content";
import NoAvatar from "../assets/images/avatar.png";
import ChatItem from "../components.jsx/ChatItem";
import { useState } from "react";
import { Profile } from "../components.jsx/Profile";

export default function ChatApp() {
  const [newChat, setNewChat] = useState(false);
  const [chat, setChat] = useState(false);
  const [onProfile, setOnProfile] = useState(false);

  return (
    <div className="chat-app">
      <div className="container">
        <div className="sidebar">
          <Profile open={onProfile} setOpen={setOnProfile} />
          <div className="wrapper">
            <div className="top">
              <div className="user-wrapper" onClick={() => setOnProfile(true)}>
                <img src={NoAvatar} alt="" />
              </div>
              {newChat && <span className="heading">New conversation</span>}
              <div
                className="add-icon"
                onClick={() => setNewChat((prev) => !prev)}
              >
                <i
                  className={`fa-solid fa-plus ${newChat ? "active" : ""}`}
                ></i>
              </div>
            </div>

            <div className="center">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder={newChat ? "Search User" : "Search Chat"}
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>

            <div className="bottom">
              {newChat ? (
                <div className="users-wrapper">
                  {[...Array(20)].map((item, index) => (
                    <div
                      key={index}
                      className="user-item"
                      onClick={() => setChat(true)}
                    >
                      <img src={NoAvatar} alt="" className="user-avatar" />
                      <span className="username">{"John Doe"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chats-wrapper">
                  {[...Array(10)].map((item, index) => (
                    <ChatItem key={index} setChat={setChat} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Content chat={chat} setChat={setChat} />
      </div>
    </div>
  );
}
