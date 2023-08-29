import { useContext, useRef, useState } from "react";
import "../assets/css/profile.css";
import NoProfile from "../assets/images/noprofile.png";
import { Context } from "../context/Context";
import { updateUserAsync } from "../services/chatServices";
import { signOutUser, updateProfile } from "../context/Actions";
import { ACTION_START, UPDATE_PROFILE_FAILED } from "../context/Constants";
import { logoutAsync } from "../services/authServices";
import { v4 as getID } from "uuid";

export const Profile = ({ open, setOpen }) => {
  const { auth, user, dispatch, loading } = useContext(Context);
  const [onEdit, setOnEdit] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleImages = (e) => {
    const file = e.target.files[0];
    const newImage = {
      origin: file.name,
      filename: getID() + "-" + file.name,
      file: file,
      type: "profile",
    };
    setProfileImage(newImage);
  };

  const handleOnEdit = () => {
    if (!user) return;
    setUsername(user.username);
    setStatus(user.description);
    setOnEdit(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setOnEdit(false);
  };

  const handleLogout = async () => {
    await logoutAsync();
    dispatch(signOutUser());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;

    try {
      dispatch({ type: ACTION_START });
      const tempUser = {
        username,
        status: status ? status : "Hello from my country 😀",
      };

      const data = {
        profile: profileImage,
      };
      const res = await updateUserAsync(tempUser, data);
      if (res) {
        dispatch(updateProfile(res));
      }
      setOnEdit(false);
    } catch (error) {
      console.log(error);
      dispatch({ type: UPDATE_PROFILE_FAILED });
    }
  };

  return (
    <div className={open ? "profile active" : "profile"}>
      <div className="profile-wrapper">
        <div className="profile-topbar">
          <span className="profile-heading">
            {onEdit ? "Edit Profile" : "Profile"}
          </span>
          <div
            className="profile-close-icon"
            onClick={() => {
              setOpen(false);
              setOnEdit(false);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {onEdit ? (
          <div className="profile-infos">
            <div className="avatar-wrapper">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage?.file)}
                  alt=""
                  className="avatar"
                />
              ) : (
                <img
                  src={user?.profile ? user.profile.url : NoProfile}
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
              <img
                src={user?.profile ? user.profile.url : NoProfile}
                alt=""
                className="avatar"
              />
            </div>
            <span className="username">{user?.username}</span>
            <span className="email">{user?.email}</span>
            <p className="status">{user?.description}</p>
            <button onClick={handleOnEdit} className="edit-btn">
              <i className="fa-solid fa-pen-to-square"></i>Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-power-off"></i>Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
