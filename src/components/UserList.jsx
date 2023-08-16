import "../assets/css/userlist.css";
import NoAvatar from "../assets/images/avatar.png";

export const UserList = ({ open, setOpen }) => {
  const handleSelect = (user) => {
    console.log(user, "selected.");
    setOpen(false);
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
            <input type="text" className="search-input" placeholder="Search" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <div className="users-wrapper">
          <div className="users">
            {[...Array(20)].map((user, id) => (
              <div
                key={id}
                className="user-item"
                onClick={() => handleSelect(id)}
              >
                <img src={NoAvatar} alt="" className="user-avatar" />
                <span className="username">Max Crew</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
