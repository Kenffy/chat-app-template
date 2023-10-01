import { createContext, useContext, useEffect, useState } from "react";
import {
  getUserAsync,
  getUsersAsync,
  updateUserAsync,
} from "../services/services";
import useLocalStorage from "../hooks/useLocalStorage";
import { auth } from "../config/dbconfig";
import { onAuthStateChanged } from "firebase/auth";
import { logoutAsync } from "../services/authServices";

const Context = createContext();

export function useContacts() {
  return useContext(Context);
}

export const ContactProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("auth", null);
  const [currentUser, setCurrentUser] = useLocalStorage("user", null);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    verifyAuthUser();
  }, []);

  const searchContacts = (toSearch) => {
    if (toSearch) {
      setContacts((prev) =>
        prev?.filter((u) =>
          u.username.toLowerCase().includes(toSearch.toLowerCase())
        )
      );
    } else {
      setContacts(users);
    }
  };

  const handleLogout = async () => {
    await logoutAsync();
    setUser(null);
    setCurrentUser(null);
  };

  const handleUpdateUser = async (toUpdate, data) => {
    try {
      setLoading(true);
      const res = await updateUserAsync(toUpdate, data);
      if (res) {
        setCurrentUser(res);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const verifyAuthUser = () => {
    return onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        const tmpUser = await getUserAsync(currUser.uid);
        const tmpUsers = await getUsersAsync(tmpUser);

        setUser({
          uid: currUser.uid,
          username: currUser.displayName,
          profile: currUser.photoURL,
          email: currUser.email,
        });
        tmpUser && setCurrentUser(tmpUser);

        if (tmpUsers) {
          setUsers(tmpUsers);
          setContacts(tmpUsers);
        }
      } else {
        handleLogout();
      }
    });
  };

  const value = {
    user,
    currentUser,
    contacts,
    loading,
    setUser,
    setCurrentUser,
    searchContacts,
    setContactIndex: setSelectedIndex,
    selectedContact: contacts[selectedIndex],
    updateUser: handleUpdateUser,
    logout: handleLogout,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
