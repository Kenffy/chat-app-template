import * as services from "../services/chatServices";
import {
  LOADING_APP_START,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOADING_APP_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  LOGIN_FAILED,
  LOADING_APP_FAILED,
} from "./Constants";

import { auth } from "../config/dbconfig";
import { onAuthStateChanged } from "firebase/auth";

export function signInUser({ auth, user }) {
  return {
    type: LOGIN_SUCCESS,
    payload: { auth, user },
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
  return onAuthStateChanged(auth, async (usr) => {
    dispatch({ type: LOADING_APP_START });
    if (usr) {
      const userdata = await services.getUserAsync(usr.uid);
      dispatch(signInUser({ auth: usr, user: userdata }));
      dispatch({ type: LOADING_APP_SUCCESS });
    } else {
      dispatch({ type: LOGIN_FAILED });
      dispatch({ type: LOADING_APP_FAILED });
    }
  });
}
