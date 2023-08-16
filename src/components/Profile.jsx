import { useRef, useState } from "react";
import "../assets/css/profile.css";
import NoAvatar from "../assets/images/avatar.png";

export const Profile = ({ open, setOpen }) => {
  const [onEdit, setOnEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  const handleCancel = (e) => {
    e.preventDefault();
    console.log("cancel");
    setOnEdit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return;

    const user = {
      username,
      status: status ? status : "Hello from my country 😀",
    };
    console.log(user);
    setOnEdit(false);
  };

  return (
    <div className={open ? "profile active" : "profile"}>
      <div className="profile-wrapper">
        <div className="profile-topbar">
          <span className="profile-heading">Profile</span>
          <div className="profile-close-icon" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {onEdit ? (
          <div className="profile-infos">
            <div className="avatar-wrapper">
              <img src={NoAvatar} alt="" className="avatar" />
              <i className="fa-solid fa-camera"></i>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <input
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                placeholder="Username"
              />
              <textarea
                onChange={(e) => setStatus(e.target.value)}
                type="text"
                placeholder="Write something about you."
              />
              <div className="profile-actions">
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-infos">
            <div className="avatar-wrapper">
              <img src={NoAvatar} alt="" className="avatar" />
            </div>
            <span className="username">John Doe</span>
            <span className="email">johndoe@example.com</span>
            <p className="status">Hello from my country 😀</p>
            <button onClick={() => setOnEdit(true)} className="edit-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
