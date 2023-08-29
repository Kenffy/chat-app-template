import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";
import { verifyAuth } from "./Actions";

const initState = {
  initialized: false,
  auth: JSON.parse(localStorage.getItem("chat_user")) || null,
  user: null,
  chats: [],
  loading: false,
  error: false,
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initState);

  const loadingApp = async () => {
    verifyAuth(dispatch);
  };

  useEffect(() => {
    loadingApp();
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <Context.Provider
      value={{
        auth: state.auth,
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
