import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";
import * as services from "../services/services";
import {
  GET_CONVERSATIONS_START,
  GET_CONVERSATIONS_SUCCESS,
  GET_CONVERSATIONS_FAILED,
} from "./Constants";
import { verifyAuth } from "./Actions";

const INITIAL_STATE = {
  initialized: false,
  user: JSON.parse(localStorage.getItem("chat_user")) || null,
  currentUser: null,
  conversations: [],
  loading: false,
  error: false,
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  //   const loadDataApp = async () => {
  //     dispatch({ type: GET_CONVERSATIONS_START });
  //     try {
  //       const res = await services.getConversations();
  //       if (res.status === 200) {
  //         dispatch({ type: GET_CONVERSATIONS_SUCCESS, payload: res.data });
  //       } else {
  //         dispatch({ type: GET_CONVERSATIONS_FAILED });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       dispatch({ type: GET_CONVERSATIONS_FAILED });
  //     }
  //   };

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
        user: state.user,
        currentUser: state.currentUser,
        articles: state.articles,
        selectedArticle: state.selectedArticle,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
