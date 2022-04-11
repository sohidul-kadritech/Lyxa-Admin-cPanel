import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  admin: localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null,
  message: "",
  accessToken: localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true
      };

    case LOGIN_SUCCESS:
      const { admin, accessToken, message } = action.payload;

      return {
        ...state,
        loading: false,
        admin,
        accessToken,
        message
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
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default login;
