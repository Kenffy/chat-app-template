import "../assets/css/chatapp.css";
import { useState } from "react";
import { Content } from "../components/Content";
import { Sidebar } from "../components/SideBar";

export const ChatApp = () => {
  const [chat, setChat] = useState(false);
  return (
    <div className="chat-app">
      <div className="app-container">
        <Sidebar setChat={setChat} />
        <Content chat={chat} setChat={setChat} />
      </div>
    </div>
  );
};
