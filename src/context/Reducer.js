import {
  LOADING_APP_FAILED,
  LOADING_APP_START,
  LOADING_APP_SUCCESS,
  LOGIN_FAILED,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  REGISTER_START,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_START,
  UPDATE_PROFILE_SUCCESS,
} from "./Constants";

const Reducer = (state, action) => {
  switch (action.type) {
    case LOGIN_START:
    case LOGOUT_START:
    case REGISTER_START:
    case LOADING_APP_START:
    case UPDATE_PROFILE_START:
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
        user: {
          uid: action.payload.user.uid,
          username: action.payload.user.displayName,
          profile: action.payload.user.photoURL,
          email: action.payload.user.email,
        },
        currentUser: action.payload.currentUser,
        loading: false,
        error: false,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload.username,
          profile: action.payload.profile,
          email: action.payload.email,
        },
        currentUser: {
          ...action.payload.currentUser,
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
        user: null,
        currentUser: null,
        loading: false,
        error: false,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        currentUser: null,
        loading: false,
        error: true,
      };
    case LOADING_APP_FAILED:
    case UPDATE_PROFILE_FAILED:
      return {
        ...state,
        initialized: false,
      };
    default:
      return state;
  }
};

export default Reducer;
