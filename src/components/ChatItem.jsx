import "../assets/css/chatitem.css";
import NoAvatar from "../assets/images/avatar.png";

export const ChatItem = ({ setChat }) => {
  return (
    <div className="chat-item" onClick={() => setChat(true)}>
      <img src={NoAvatar} alt="" className="chat-avatar" />
      <div className="chat-infos">
        <div className="user-infos">
          <span className="username">John Doe</span>
          <span className="timeline">2 weeks ago</span>
        </div>
        <p className="last-message">You: Say Hi! to John Doe</p>
      </div>
    </div>
  );
};
