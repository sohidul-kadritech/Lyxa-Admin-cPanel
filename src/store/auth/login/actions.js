import { LOGIN } from "../../../network/Api";
import { LOGIN_USER, LOGIN_SUCCESS, LOGOUT_USER, LOGOUT_USER_SUCCESS, API_ERROR, SET_ADMIN } from "./actionTypes";
import requestApi from "../../../network/httpRequest";
import { successMsg } from "../../../helpers/successMsg";
import setCookiesAsObject from '../../../helpers/cookies/setCookiesAsObject';

export const loginSuccess = (admin, accessToken, message) => {
  return {
    type: LOGIN_SUCCESS,
    payload: { admin, accessToken, message },
  };
};

export const logoutUser = (history) => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
  };
};

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error,
  };
};

export const logoutAdmin = () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER_SUCCESS,
  });
};

export const adminAuth = (user) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(LOGIN, {
      method: "POST",
      data: user,
    });

    if (status) {
      localStorage.setItem("accessToken", data.admin.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      
      // set cookies
      const authCookies = {
        access_token: data.admin.token,
        account_type: data.admin.account_type,
        account_id: data.admin._id,
      }

      setCookiesAsObject(authCookies, 15)

      dispatch(loginSuccess(data.admin, data.admin.token, message));
    } else {
      successMsg(error, "error");
      dispatch(apiError(message));

      localStorage.removeItem("accessToken");
    }
  } catch (error) {
    dispatch(apiError(error.message));
  }
};

export const setAdmin = (admin) => (dispatch) => {
  dispatch({
    type: SET_ADMIN,
    payload: admin,
  })
}