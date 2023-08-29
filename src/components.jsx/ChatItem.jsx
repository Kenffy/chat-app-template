import { format } from "timeago.js";
import "../assets/css/chatitem.css";
import NoProfile from "../assets/images/noprofile.png";

export default function ChatItem({ chat, active, handleCurrentChat }) {
  let lastMessage = "";
  if (chat?.last?.createdAt) {
    lastMessage = chat?.last?.message ? chat.last.message : "•••";
  } else {
    lastMessage = `You: Say hi! to ${chat?.friend?.username}`;
  }

  return (
    <div
      className={active ? "chat-item active" : "chat-item"}
      onClick={() => handleCurrentChat(chat)}
    >
      <img
        src={chat?.friend?.profile ? chat?.friend.profile.url : NoProfile}
        alt=""
        className="chat-avatar"
      />
      <div className="chat-infos">
        <div className="user-infos">
          <span className="username">{chat?.friend?.username}</span>

          {chat?.last?.createdAt && (
            <span className="timeline">
              {format(chat.last.createdAt?.toDate())}
            </span>
          )}
        </div>
        <p className="last-message">{lastMessage}</p>
      </div>
    </div>
  );
}
