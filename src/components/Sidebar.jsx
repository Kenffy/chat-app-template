import { useState } from "react";
import "../assets/css/sidebar.css";
import NoAvatar from "../assets/images/avatar.png";
import { ChatItem } from "./ChatItem";
import { Profile } from "./Profile";
import { UserList } from "./UserList";
import { useContacts } from "../context/ContactProvider";

export const Sidebar = ({
  chats,
  setChats,
  currentChat,
  filteredChats,
  handleSearchChat,
  setFilteredChats,
  handleCurrentChat,
}) => {
  const { logout, currentUser } = useContacts();
  const [onMenu, setOnMenu] = useState(false);
  const [onProfile, setOnProfile] = useState(false);
  const [onNewChat, setOnNewChat] = useState(false);

  return (
    <div className="sidebar">
      <Profile open={onProfile} setOpen={setOnProfile} />
      <UserList
        open={onNewChat}
        setOpen={setOnNewChat}
        chats={chats}
        setChats={setChats}
        setFilteredChats={setFilteredChats}
        handleCurrentChat={handleCurrentChat}
      />
      <div className="sidebar-wrapper">
        <div className="sidebar-top">
          <div className="user-wrapper" onClick={() => setOnProfile(true)}>
            <img
              src={currentUser?.profile ? currentUser.profile.url : NoAvatar}
              alt=""
            />
          </div>
          <div
            className="menu-icon"
            tabIndex={0}
            onBlur={() => setOnMenu(false)}
            onClick={() => setOnMenu((prev) => !prev)}
          >
            <i className="fa-solid fa-ellipsis"></i>
            {onMenu && (
              <div className="menu-wrapper">
                <span className="menu-item" onClick={() => setOnNewChat(true)}>
                  <i className="fa-solid fa-comment-medical"></i>
                  New Chat
                </span>
                <span className="menu-item">
                  <i className="fa-solid fa-users-line"></i>
                  New Group
                </span>
                <span className="menu-item">
                  <i className="fa-solid fa-circle-half-stroke"></i>
                  Dark Mode
                </span>
                <span className="menu-item" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-middle">
          <div className="search-wrapper">
            <input
              onChange={handleSearchChat}
              type="text"
              placeholder="Search Chat"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="chats-wrapper">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat?.id}
                setChat={() => handleCurrentChat(chat)}
                chat={chat}
                currentChat={currentChat}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
