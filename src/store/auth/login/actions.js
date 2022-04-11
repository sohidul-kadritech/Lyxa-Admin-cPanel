import { Redirect } from "react-router-dom";
import { LOGIN } from "../../../network/Api";
import { createBrowserHistory } from "history";
import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR
} from "./actionTypes";
import requestApi from "../../../network/httpRequest";

export const loginUser = () => {
  // console.log("request", user);
  return {
    type: LOGIN_USER
  };
};

export const loginSuccess = (admin, accessToken, message) => {
  // console.log(user);
  return {
    type: LOGIN_SUCCESS,
    payload: { admin, accessToken, message }
  };
};

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history }
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS
  };
};

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error
  };
};

export const logoutAdmin = () => dispatch => {
  dispatch({
    type: LOGOUT_USER_SUCCESS
  });
};

export const adminAuth = user => async (dispatch, getState) => {
  try {
    dispatch(loginUser(user));

    const { data } = await requestApi().request(LOGIN, {
      method: "POST",
      data: user
    });

    const { status, accessToken, admin, message, error } = data;
    if (status) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("admin", JSON.stringify(admin));

      dispatch(loginSuccess(admin, accessToken, message));
    } else {
      dispatch(apiError(error));
    }
  } catch (error) {
    dispatch(apiError(error.message));
  }
};
