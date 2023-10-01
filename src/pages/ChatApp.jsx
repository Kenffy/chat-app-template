import "../assets/css/chatapp.css";
import { useEffect, useState } from "react";
import { Content } from "../components/Content";
import { getUserConversationsAsync } from "../services/services";
import { Sidebar } from "../components/Sidebar";
import { useContacts } from "../context/ContactProvider";

export const ChatApp = () => {
  const { user, currentUser } = useContacts();
  const [chats, setChats] = useState([]);
  const [onChat, setOnChat] = useState(false);
  const [filteredChats, setFilteredChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      const res = await getUserConversationsAsync(user);
      setChats(res);
      setFilteredChats(res);
      const currChatId = JSON.parse(localStorage.getItem("chat_id"));
      currChatId && setCurrentChat(res.find((c) => c.friend.id === currChatId));
    };
    currentUser && loadConversations();
  }, [currentUser]);

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
    setChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
    setFilteredChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
    localStorage.setItem("chat_id", JSON.stringify(chat.friend?.id));
    setOnChat(true);
  };

  const handleSearchChat = (e) => {
    e.preventDefault();
    const toSearch = e.target.value;
    if (toSearch) {
      setFilteredChats(
        chats?.filter((chat) =>
          chat.friend.username.toLowerCase().includes(toSearch.toLowerCase())
        )
      );
    } else {
      setFilteredChats(chats);
    }
  };

  return (
    <div className="chat-app">
      <div className="app-container">
        <Sidebar
          chats={chats}
          setChats={setChats}
          currentChat={currentChat}
          filteredChats={filteredChats}
          handleSearchChat={handleSearchChat}
          setFilteredChats={setFilteredChats}
          handleCurrentChat={handleCurrentChat}
        />
        <Content
          user={user}
          chat={currentChat}
          onChat={onChat}
          setChat={setCurrentChat}
          setOnChat={setOnChat}
          setChats={setChats}
          setFilteredChats={setFilteredChats}
        />
      </div>
    </div>
  );
};
