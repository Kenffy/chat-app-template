import "../assets/css/chatitem.css";
import NoAvatar from "../assets/images/avatar.png";

export default function ChatItem({ setChat }) {
  return (
    <div className={"chat-item"} onClick={() => setChat(true)}>
      <img src={NoAvatar} alt="" className="chat-avatar" />
      <div className="chat-infos">
        <div className="user-infos">
          <span className="username">John Doe</span>

          <span className="timeline">2 days ago</span>
        </div>
        <p className="last-message">You: Say hi! to John Doe</p>
      </div>
    </div>
  );
}
