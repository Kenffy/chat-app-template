import "../assets/css/chatitem.css";
import { format } from "timeago.js";
import Avatar from "./Avatar";

export const ChatItem = ({ setChat, chat, isActive }) => {
  let lastMessage = `You: Say hi! to ${chat?.friend?.username}`;
  if (chat?.last?.message) {
    lastMessage =
      chat.last.message.length > 25
        ? chat.last.message.slice(0, 25) + "..."
        : chat.last.message;
    // if (tmpLastMessage) {
    //   lastMessage = chat.messages[chat.messages.length - 1]?.message;
    // } else if (tmpLastMessage.images.length > 0) {
    //   lastMessage = "📷 Image message";
    // } else if (lastMessage.audio) {
    //   lastMessage = "🎧 Audio Message";
    // }
  }

  return (
    <div
      className={isActive ? "chat-item active" : "chat-item"}
      onClick={() => setChat(true)}
    >
      <Avatar
        height={45}
        width={45}
        src={chat?.friend?.profile ? chat.friend.profile : ""}
        alt=""
        className="chat-avatar"
      />
      <div className="chat-infos">
        <div className="user-infos">
          <span className="username">{chat?.friend?.username}</span>
          {chat?.last?.createdAt && (
            <span className="timeline">
              {format(chat.last?.createdAt?.toDate())}
            </span>
          )}
        </div>
        <p className="last-message">{lastMessage}</p>
      </div>
    </div>
  );
};
