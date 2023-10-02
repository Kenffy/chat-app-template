import "../assets/css/chatapp.css";
import { useState } from "react";
import { Content } from "../components/Content";
import { Sidebar } from "../components/Sidebar";

export const ChatApp = () => {
  const [onChat, setOnChat] = useState(false);

  return (
    <div className="chat-app">
      <div className="app-container">
        <Sidebar />
        <Content onChat={onChat} setOnChat={setOnChat} />
      </div>
    </div>
  );
};
