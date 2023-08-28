import { useContext, useRef, useState } from "react";
import "../assets/css/profile.css";
import NoAvatar from "../assets/images/avatar.png";
// import { Context } from "../context/Context";
// import { v4 as getID } from "uuid";
// import { updateUserAsync } from "../services/services";
// import { updateProfile } from "../context/Actions";
// import {
//   UPDATE_PROFILE_FAILED,
//   UPDATE_PROFILE_START,
// } from "../context/Constants";

export const Profile = ({ open, setOpen }) => {
  // const { currentUser, user, dispatch, loading } = useContext(Context);
  const [onEdit, setOnEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleImages = (e) => {
    const file = e.target.files[0];
    const newImage = {
      filename: new Date().getTime() + "-" + file.name,
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
    console.log("cancel");
    setOnEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;

    // try {
    //   dispatch({ type: UPDATE_PROFILE_START });
    //   const user = {
    //     username,
    //     status: status ? status : "Hello from my country 😀",
    //   };

    //   const data = {
    //     profile: profileImage,
    //   };
    //   const res = await updateUserAsync(user, data);
    //   if (res) {
    //     dispatch(updateProfile(res));
    //   }
    //   setOnEdit(false);
    // } catch (error) {
    //   console.log(error);
    //   dispatch({ type: UPDATE_PROFILE_FAILED });
    // }
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
                <img src={NoAvatar} alt="" className="avatar" />
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
              <img src={NoAvatar} alt="" className="avatar" />
            </div>
            <span className="username">{"John Doe"}</span>
            <span className="email">{"johndoe@email.com"}</span>
            <p className="status">{"some description"}</p>
            <button onClick={() => setOnEdit(true)} className="edit-btn">
              <i className="fa-solid fa-pen-to-square"></i>Profile
            </button>
            <button className="logout-btn">
              <i className="fa-solid fa-power-off"></i>Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
