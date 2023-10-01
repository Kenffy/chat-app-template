import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "./SocketProvider";
import { useContacts } from "./ContactProvider";
import { v4 as getID } from "uuid";

const Context = createContext();

export function useConversations() {
  return useContext(Context);
}

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );

  let chats = [];
  const socket = useSocket();
  const { auth, contacts, onlineContacts } = useContacts();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currConversation, setCurrConversation] = useState(
    conversations.length > 0 ? conversations[selectedIndex] : null
  );

  const searchConversations = (toSearch) => {
    console.log(toSearch);
  };

  const createConversation = (contactId) => {
    if (!auth) return;

    if (!isConversationAvailable([auth.id, contactId])) {
      const conv = {
        id: getID(),
        members: [auth.id, contactId],
        messages: [],
        createdAt: new Date(),
      };
      setConversations((prev) => [...prev, conv]);
      setCurrConversation(conv);
    }
  };

  const handleSetCurrConversation = (index) => {
    setSelectedIndex(index);
    setCurrConversation(conversations[index]);
  };

  const handleCloseConversation = () => {
    setSelectedIndex(undefined);
    setCurrConversation(null);
  };

  const handleDeleteMessages = () => {
    if (currConversation == null) return;

    const selectedConversation = currConversation;
    selectedConversation.messages = [];
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation?.id ? selectedConversation : conv
      )
    );
  };

  const handleDeleteConversation = (id) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
  };

  useEffect(() => {
    if (socket == null || currConversation == null) return;

    socket?.on("getMessage", (message) => {
      if (message.images.length > 0) {
        let urls = [];
        for (const image of message.images) {
          const fileReader = new FileReader();
          const blob = new Blob([image.file], { type: "image/png" });
          fileReader.readAsDataURL(blob);
          fileReader.addEventListener("load", () => {
            urls.push(fileReader.result);
          });
        }
        message.images = urls;
      }

      const selectedConversation = currConversation;
      selectedConversation.messages.push(message);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation?.id ? selectedConversation : conv
        )
      );
    });

    return () => socket.off("getMessage");
  }, [socket, currConversation]);

  const sendMessage = (message, medias) => {
    if (currConversation == null) return;

    if (medias?.images.length > 0) {
      let urls = [];
      for (const image of message.images) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(image.file);
        fileReader.addEventListener("load", () => {
          urls.push(fileReader.result);
        });
      }
      message.images = urls;
    }

    const toSendMessage = {
      ...message,
      images: medias.images,
      audio: medias.audio,
    };

    socket.emit("sendMessage", toSendMessage);
    const selectedConversation = currConversation;
    selectedConversation.messages.push(message);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation?.id ? selectedConversation : conv
      )
    );
  };

  const isConversationAvailable = (members) => {
    return conversations.find((c) =>
      c.members.every((id) => members.includes(id))
    );
  };

  if (auth) {
    conversations.forEach((conv) => {
      const friendId = conv.members.find((id) => id !== auth.id);

      if (friendId) {
        const friend = contacts?.find((u) => u.id === friendId);
        const isOnline = onlineContacts.find((c) => c.userId === friendId);
        friend &&
          chats.push({
            ...conv,
            friend: {
              username: friend?.username,
              profile: friend?.profile ? friend.profile.url : "",
              online: isOnline ? true : false,
            },
          });
      }
    });
  }

  const value = {
    chats,
    sendMessage,
    searchConversations,
    createConversation,
    selectConversation: handleSetCurrConversation,
    selectedConversation: chats[selectedIndex],
    closeConversation: handleCloseConversation,
    deleteConversation: handleDeleteConversation,
    deleteConversationMessages: handleDeleteMessages,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
