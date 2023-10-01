import { useState } from "react";
import "../assets/css/profile.css";
import { v4 as getID } from "uuid";
import { useContacts } from "../context/ContactProvider";
import Avatar from "./Avatar";

export const Profile = ({ open, setOpen }) => {
  const { currentUser, updateUser, loading } = useContacts();
  const [onEdit, setOnEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleImages = (e) => {
    const file = e.target.files[0];
    const newImage = {
      filename: getID() + "-" + file.name,
      file: file,
      type: "profile",
    };
    setProfileImage(newImage);
  };

  const handleOnEdit = () => {
    if (!currentUser) return;
    setUsername(currentUser.username);
    setStatus(currentUser.description);
    setOnEdit(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setOnEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;

    const user = {
      username,
      status: status ? status : "Hello from my country 😀",
    };

    const data = {
      profile: profileImage,
    };
    updateUser(user, data);
    setOnEdit(false);
  };

  return (
    <div className={open ? "profile active" : "profile"}>
      <div className="profile-wrapper">
        <div className="profile-topbar">
          <span className="profile-heading">
            {onEdit ? "Edit Profile" : "Profile"}
          </span>
          <div className="profile-close-icon" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {onEdit ? (
          <div className="profile-infos">
            <div className="avatar-wrapper">
              {profileImage ? (
                <Avatar
                  height={150}
                  width={150}
                  src={URL.createObjectURL(profileImage?.file)}
                  alt=""
                  className="avatar"
                />
              ) : (
                <Avatar
                  height={150}
                  width={150}
                  src={currentUser?.profile ? currentUser.profile.url : ""}
                  alt=""
                  className="avatar"
                />
              )}
              <label className="media-item" htmlFor="upload-images">
                <input
                  style={{ display: "none" }}
                  accept=".jpg,.jpeg,.png"
                  id="upload-images"
                  type="file"
                  multiple
                  onChange={handleImages}
                />
                <i className="fa-solid fa-camera"></i>
              </label>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                type="text"
                placeholder="Username"
              />
              <textarea
                onChange={(e) => setStatus(e.target.value)}
                type="text"
                value={status}
                placeholder="Write something about you."
              />
              <div className="profile-actions">
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="save-btn">
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-infos">
            <div className="avatar-wrapper">
              <Avatar
                height={150}
                width={150}
                src={currentUser?.profile ? currentUser.profile.url : ""}
                alt=""
                className="avatar"
              />
            </div>
            <span className="username">{currentUser?.username}</span>
            <span className="email">{currentUser?.email}</span>
            <p className="status">{currentUser?.description}</p>
            <button onClick={handleOnEdit} className="edit-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
