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
import { toast } from "react-toastify";

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
  // console.log({user})
  try {
    dispatch(loginUser());

    const { data: {status, message , error, data } } = await requestApi().request(LOGIN, {
      method: "POST",
      data: user
    });

    // console.log({data})
    // const { status, message, error} = data;
    if (status) {
      // const {name , token, email, status, number} = admin;
      // const adminInfo = {name, email, status, number}

      localStorage.setItem("accessToken", data.admin.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      

      dispatch(loginSuccess(data.admin, data.admin.token, message));
    } else {
      toast.warn(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(apiError(error));
    }
  } catch (error) {
    dispatch(apiError(error.message));
  }
};
