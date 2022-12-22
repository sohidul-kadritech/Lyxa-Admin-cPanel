import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  RESET_PROFILE_FLAG,
} from "./actionTypes";
import * as actionTypes from "../../actionType";
import requestApi from "./../../../network/httpRequest";
import { CHANGE_PASSWORD } from "../../../network/Api";
import { toast } from "react-toastify";

export const editProfile = (user) => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  };
};

export const profileSuccess = (msg) => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  };
};

export const profileError = (error) => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  };
};

export const resetProfileFlag = (error) => {
  return {
    type: RESET_PROFILE_FLAG,
  };
};

// CHANGE PASSWORD

export const changePassword = (password, userType) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_REQUEST_SEND,
    });

    const {
      data: { status, error, message },
    } = await requestApi().request(CHANGE_PASSWORD + `?userType=${userType}`, {
      method: "POST",
      data: {
        password,
      },
    });

    console.log({ status, message });

    if (status) {
      toast.success(message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_REQUEST_SUCCESS,
        payload: message,
      });
    } else {
      toast.warn(error, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    toast.warn(error.message, {
      // position: "bottom-right",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_REQUEST_FAIL,
      payload: error.message,
    });
  }
};
