import "../assets/css/chatitem.css";
import { format } from "timeago.js";
import NoAvatar from "../assets/images/avatar.png";

export const ChatItem = ({ setChat, chat, currentChat }) => {
  return (
    <div
      className={
        chat?.id === currentChat?.id ? "chat-item active" : "chat-item"
      }
      onClick={() => setChat(true)}
    >
      <img
        src={chat?.friend?.profile ? chat?.friend.profile.url : NoAvatar}
        alt=""
        className="chat-avatar"
      />
      <div className="chat-infos">
        <div className="user-infos">
          <span className="username">{chat?.friend?.username}</span>
          {chat?.last?.createdAt && (
            <span className="timeline">{format(chat.last.createdAt)}</span>
          )}
        </div>
        <p className="last-message">
          {chat?.last?.message
            ? chat.last.message
            : `You: Say hi! to ${chat.friend.username}`}
        </p>
      </div>
    </div>
  );
};
