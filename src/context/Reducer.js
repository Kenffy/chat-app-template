import {
  ACTION_FAILED,
  ACTION_START,
  LOADING_APP_FAILED,
  LOADING_APP_START,
  LOADING_APP_SUCCESS,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
} from "./Constants";

const Reducer = (state, action) => {
  switch (action.type) {
    case ACTION_START:
    case LOADING_APP_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case LOADING_APP_SUCCESS:
      return {
        ...state,
        initialized: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        auth: {
          uid: action.payload.auth.uid,
          username: action.payload.auth.displayName,
          profile: action.payload.auth.photoURL,
          email: action.payload.auth.email,
        },
        user: action.payload.user,
        loading: false,
        error: false,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          username: action.payload.username,
          profile: action.payload.profile,
          email: action.payload.email,
        },
        user: {
          ...action.payload.user,
          username: action.payload.username,
          profile: action.payload.profile,
          email: action.payload.email,
        },
        loading: false,
        error: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        auth: null,
        user: null,
        loading: false,
        error: false,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        auth: null,
        user: null,
        loading: false,
        error: true,
      };
    case LOADING_APP_FAILED:
      return {
        ...state,
        initialized: false,
      };
    case ACTION_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default Reducer;
