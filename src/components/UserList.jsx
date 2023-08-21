import { useContext, useEffect, useState } from "react";
import "../assets/css/userlist.css";
import NoAvatar from "../assets/images/avatar.png";
import { createConversationAsync, getUsersAsync } from "../services/services";
import { Context } from "../context/Context";

export const UserList = ({
  open,
  setOpen,
  chats,
  setChats,
  setFilteredChats,
  handleCurrentChat,
}) => {
  const { user } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsersAsync(user);
      setUsers(res);
      setFilteredUsers(res);
    };
    loadUsers();
  }, [user]);

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    var toSearch = e.target.value;
    if (toSearch) {
      setFilteredUsers((prev) =>
        prev?.filter((u) =>
          u.username.toLowerCase().includes(toSearch.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  };

  const handleCreateConversation = async (friend) => {
    const conv = chats.find((c) => c.friend.id === friend.id);
    if (conv) {
      handleCurrentChat(conv);
      setOpen(false);
    } else {
      const res = await createConversationAsync(user, friend?.id);
      setChats((prev) => [...prev, res]);
      setFilteredChats((prev) => [...prev, res]);
      handleCurrentChat(res);
      setOpen(false);
    }
  };

  return (
    <div className={open ? "user-list active" : "user-list"}>
      <div className="user-list-wrapper">
        <div className="user-list-topbar">
          <span className="heading">Start a conversation</span>
          <div className="close-icon" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        <div className="user-list-middle">
          <div className="search-wrapper">
            <input
              onChange={handleSearchUsers}
              type="text"
              className="search-input"
              placeholder="Search"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <div className="users-wrapper">
          <div className="users">
            {filteredUsers.map((usr) => (
              <div
                key={usr?.id}
                className="user-item"
                onClick={() => handleCreateConversation(usr)}
              >
                <img
                  src={usr?.profile ? usr.profile.url : NoAvatar}
                  alt=""
                  className="user-avatar"
                />
                <span className="username">{usr?.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
