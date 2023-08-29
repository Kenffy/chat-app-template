import "../assets/css/chatapp.css";
import NoProfile from "../assets/images/noprofile.png";
import ChatItem from "../components.jsx/ChatItem";
import { useContext, useEffect, useState } from "react";
import { Profile } from "../components.jsx/Profile";
import Content from "../components.jsx/Content";
import { Context } from "../context/Context";
import {
  getUserConversationsAsync,
  getUsersAsync,
} from "../services/chatServices";

export default function ChatApp() {
  const { auth, user } = useContext(Context);
  const [currChat, setCurrChat] = useState(null);
  const [search, setSearch] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [onProfile, setOnProfile] = useState(false);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const chat_res = await getUserConversationsAsync(auth);
      if (chat_res) {
        setChats(chat_res);
        setFilteredChats(chat_res);
        const currChatId = JSON.parse(localStorage.getItem("chatId"));
        currChatId &&
          setCurrChat(chat_res.find((c) => c.friend.id === currChatId));
      }

      const user_res = await getUsersAsync(user);
      if (user_res) {
        setUsers(user_res);
        setFilteredUsers(user_res);
      }
    };
    user && loadData();
  }, [user]);

  const handleCurrentChat = (chat) => {
    setCurrChat(chat);
    setChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
    setFilteredChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
    localStorage.setItem("chatId", JSON.stringify(chat.friend?.id));
    //setOnChat(true);
  };

  const handleCreateConversation = async (friend) => {
    const conv = chats.find((c) => c.friend.id === friend.id);
    if (conv) {
      handleCurrentChat(conv);
      setNewChat(false);
    } else {
      const res = await createConversationAsync(user, friend?.id);
      setChats((prev) => [...prev, res]);
      setFilteredChats((prev) => [...prev, res]);
      handleCurrentChat(res);
      setNewChat(false);
    }
  };

  const handleSearchChat = (e) => {
    e.preventDefault();
    const toSearch = e.target.value;
    setSearch(toSearch);
    if (newChat) {
      if (toSearch) {
        setFilteredUsers((prev) =>
          prev?.filter((u) =>
            u.username.toLowerCase().includes(toSearch.toLowerCase())
          )
        );
      } else {
        setFilteredUsers(users);
      }
    } else {
      if (toSearch) {
        setFilteredChats(
          chats?.filter((chat) =>
            chat.friend.username.toLowerCase().includes(toSearch.toLowerCase())
          )
        );
      } else {
        setFilteredChats(chats);
      }
    }
  };

  return (
    <div className="chat-app">
      <div className="container">
        <div className="sidebar">
          <Profile open={onProfile} setOpen={setOnProfile} />
          <div className="wrapper">
            <div className="top">
              <div className="user-wrapper" onClick={() => setOnProfile(true)}>
                <img
                  src={user?.profile ? user.profile.url : NoProfile}
                  alt=""
                />
              </div>
              {newChat && <span className="heading">New conversation</span>}
              <div
                className="add-icon"
                onClick={() => {
                  setNewChat((prev) => !prev);
                  setSearch("");
                }}
              >
                <i
                  className={`fa-solid fa-plus ${newChat ? "active" : ""}`}
                ></i>
              </div>
            </div>

            <div className="center">
              <div className="search-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChat}
                  placeholder={newChat ? "Search User" : "Search Chat"}
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>

            <div className="bottom">
              {newChat ? (
                <div className="users-wrapper">
                  {filteredUsers.map((item) => (
                    <div
                      key={item?.id}
                      className="user-item"
                      onClick={() => handleCreateConversation(item)}
                    >
                      <img
                        src={item?.profile ? item.profile.url : NoProfile}
                        alt=""
                        className="user-avatar"
                      />
                      <span className="username">{item?.username}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chats-wrapper">
                  {filteredChats.map((chat) => (
                    <ChatItem
                      key={chat?.id}
                      chat={chat}
                      active={chat?.id === currChat?.id}
                      handleCurrentChat={handleCurrentChat}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Content
          user={user}
          chat={currChat}
          setCurrChat={setCurrChat}
          setChats={setChats}
          setFilteredChats={setFilteredChats}
        />
      </div>
    </div>
  );
}
