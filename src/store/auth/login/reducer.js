/* eslint-disable no-case-declarations */
/* eslint-disable default-param-last */
import { API_ERROR, LOGIN_SUCCESS, LOGIN_USER, LOGOUT_USER, LOGOUT_USER_SUCCESS, SET_ADMIN } from './actionTypes';

const initialState = {
  error: '',
  loading: false,
  admin: {},
  message: '',
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN:
      return {
        ...state,
        admin: action.payload,
      };

    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case LOGIN_SUCCESS:
      const { admin, message } = action.payload;

      return {
        ...state,
        loading: false,
        admin,
        message,
        error: null,
      };

    case LOGOUT_USER:
      return { ...state };

    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: null,
      };

    case API_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default login;
