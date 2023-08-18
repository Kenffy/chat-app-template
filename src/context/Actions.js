import * as services from "../services/services";
import {
  LOADING_APP_FAILED,
  LOADING_APP_START,
  LOADING_APP_SUCCESS,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
} from "./Constants";

import { auth } from "../config/dbconfig";
import { onAuthStateChanged } from "firebase/auth";
// import { getAllPostsAsync, getAllUsersAsync, getUserAsync } from '../../services/firestoreServices';
// import { loadPosts, loadStart, loadUsers } from './appActions';

export function signInUser({ user, currentUser }) {
  return {
    type: LOGIN_SUCCESS,
    payload: { user, currentUser },
  };
}

export function signOutUser() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function updateProfile(profile) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: profile,
  };
}

export function verifyAuth(dispatch) {
  return onAuthStateChanged(auth, async (user) => {
    dispatch({ type: LOADING_APP_START });
    //const conversations = await getConversationsAsync();
    if (user) {
      const userdata = await services.getUserAsync(user.uid);
      dispatch(signInUser({ user, currentUser: userdata }));
      //dispatch({type: GET_CONVERSATIONS_SUCCESS, payload: conversations});
      dispatch({ type: LOADING_APP_SUCCESS });
    } else {
      dispatch({ type: LOGIN_FAILED });
      dispatch({ type: LOADING_APP_FAILED });
    }
  });
}
