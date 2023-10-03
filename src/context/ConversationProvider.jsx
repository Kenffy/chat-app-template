import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactProvider";
import {
  createConversationAsync,
  createMessageAsync,
  dataFromSnapshot,
  deleteConversationAsync,
  deleteConversationMessagesAsync,
  deleteMessageAsync,
  getConversationQueryByUser,
  getMsgQueryByConversationId,
} from "../services/services";
import { onSnapshot } from "firebase/firestore";

const Context = createContext();

export function useConversations() {
  return useContext(Context);
}

export const ConversationProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(
    conversations.length > 0 ? conversations[0] : null
  );
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useLocalStorage("conv_id", null);

  const { currentUser, contacts } = useContacts();

  const searchConversations = (toSearch) => {
    if (toSearch) {
      setChats(
        conversations?.filter((chat) =>
          chat.friend.username.toLowerCase().includes(toSearch.toLowerCase())
        )
      );
    } else {
      setChats(conversations);
    }
  };

  const createConversation = async (contactId) => {
    const conv = isConversationAvailable([currentUser.id, contactId]);
    let success = false;
    if (conv) {
      setCurrentConversation(conv);
      return success;
    } else {
      try {
        const res = await createConversationAsync(currentUser.id, contactId);
        if (res) {
          setCurrentConversation(res);
          setConversationId(res.id);
          success = true;
        }
        return success;
      } catch (error) {
        console.log(error);
        return success;
      }
    }
  };

  const handleCurrentConversation = (conv) => {
    if (!conv) return;
    setCurrentConversation(conv);
    setConversationId(conv.id);
  };

  const handleCloseConversation = () => {
    setCurrentConversation(null);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;
    try {
      await deleteMessageAsync(messageId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessages = async () => {
    if (currentConversation == null) return;

    try {
      await deleteConversationMessagesAsync(currentConversation.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!convId) return;
    try {
      await deleteConversationAsync(convId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubcribe = loadConversations();
    return () => {
      unsubcribe();
    };
  }, [currentUser, conversationId]);

  useEffect(() => {
    loadMessages();
  }, [currentConversation]);

  const loadConversations = () => {
    if (!currentUser) return;
    const query = getConversationQueryByUser(currentUser.id);
    const unsubscribe = onSnapshot(query, (querySnapshots) => {
      let tmpConversations = [];
      querySnapshots.forEach((snapshot) => {
        const conv = dataFromSnapshot(snapshot);
        const friendId = conv.members.find((id) => id !== currentUser.id);

        if (friendId) {
          const friend = contacts?.find((u) => u.id === friendId);
          friend &&
            tmpConversations.push({
              ...conv,
              friend: {
                username: friend?.username,
                profile: friend?.profile ? friend.profile.url : "",
              },
            });
        }
      });
      setChats(tmpConversations);
      setConversations(tmpConversations);

      conversationId &&
        setCurrentConversation(
          tmpConversations.find((conv) => conv.id == conversationId)
        );
    });
    return unsubscribe;
  };

  const loadMessages = () => {
    if (!currentConversation) return;
    const query = getMsgQueryByConversationId(currentConversation.id);
    onSnapshot(query, (querySnapshots) => {
      let tmpMessages = [];
      querySnapshots.forEach((snapshot) => {
        tmpMessages.push(dataFromSnapshot(snapshot));
      });
      setMessages(tmpMessages);
    });
  };

  const sendMessage = async (message, medias) => {
    let success = false;
    try {
      const res = await createMessageAsync(message, medias);
      if (res) {
        success = true;
      }
      return success;
    } catch (error) {
      console.log(error);
      return success;
    }
  };

  const isConversationAvailable = (members) => {
    return conversations.find((c) =>
      c.members.every((id) => members.includes(id))
    );
  };

  const value = {
    chats,
    messages,
    currentChat: currentConversation,
    sendMessage,
    searchConversations,
    createConversation,
    selectConversation: handleCurrentConversation,
    closeConversation: handleCloseConversation,
    deleteMessage: handleDeleteMessage,
    deleteConversation: handleDeleteConversation,
    deleteConversationMessages: handleDeleteMessages,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
