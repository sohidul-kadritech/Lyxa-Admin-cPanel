import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SET_ADMIN
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  admin: {},
  message: "",
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN:
    return {
      ...state,
      admin: action.payload,
    }
    
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
        message: null
      };

    case LOGIN_SUCCESS:
      const { admin, accessToken, message } = action.payload;

      return {
        ...state,
        loading: false,
        admin,
        accessToken,
        message,
        error: null
      };

    case LOGOUT_USER:
      return { ...state };

    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: null
      };

    case API_ERROR:
      return { ...state, error: action.payload, loading: false, accessToken: null };

    default:
      return state;
  }
};

export default login;
