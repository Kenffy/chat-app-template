import "../assets/css/userlist.css";
import { createConversationAsync } from "../services/services";
import { useContacts } from "../context/ContactProvider";
import Avatar from "./Avatar";

export const UserList = ({
  open,
  setOpen,
  chats,
  setChats,
  setFilteredChats,
  handleCurrentChat,
}) => {
  const { user, contacts, searchContacts } = useContacts();

  const handleSearchUsers = async (e) => {
    e.preventDefault();
    var toSearch = e.target.value;
    searchContacts(toSearch);
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
            {contacts.map((usr) => (
              <div
                key={usr?.id}
                className="user-item"
                onClick={() => handleCreateConversation(usr)}
              >
                <Avatar
                  src={usr?.profile ? usr.profile.url : ""}
                  height={45}
                  width={45}
                  username={usr?.username}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
