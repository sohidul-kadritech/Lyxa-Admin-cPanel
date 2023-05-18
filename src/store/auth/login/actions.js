import { LOGIN, SINGLE_SHOP } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import { API_ERROR, LOGIN_SUCCESS, LOGIN_USER, LOGOUT_USER, LOGOUT_USER_SUCCESS, SET_ADMIN } from './actionTypes';
// import { successMsg } from "../../../helpers/successMsg";
import setCookiesAsObject from '../../../helpers/cookies/setCookiesAsObject';

export const loginSuccess = (admin, message) => ({
  type: LOGIN_SUCCESS,
  payload: { admin, message },
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS,
});

export const apiError = (error) => ({
  type: API_ERROR,
  payload: error,
});

export const logoutAdmin = () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER_SUCCESS,
  });
};

export const adminAuth = (user) => async (dispatch) => {
  console.log(user);

  try {
    dispatch({ type: LOGIN_USER });

    const {
      data: { status, message, data = null },
    } = await requestApi().request(LOGIN, {
      method: 'POST',
      data: user,
    });
    const requestOptions = {
      method: 'GET',
      params: {
        id: data?.admin?.parentShop,
      },
    };

    // console.log('action.js: ', { data });

    // console.log('data admin parentshop: ', data?.admin?.parentShop);
    let newData;

    const credentialParent = data?.admin?.parentShop || data?.admin?.parentSeller;
    if (credentialParent) {
      newData = await requestApi().request(`${SINGLE_SHOP}?id=${credentialParent}`, requestOptions);
    }

    // console.log('newData: ', newData?.data?.data?.shop);

    if (status) {
      // set cookies
      const authCookies = {
        access_token: data.admin.token,
        account_type: data.admin.account_type,
        account_id: credentialParent || data.admin._id,
        credentialUserId: data.admin._id,
      };

      setCookiesAsObject(authCookies, 15);

      let admin = {};
      if (newData?.data?.data?.shop) {
        admin = { ...newData?.data?.data?.shop, credentialUserId: data.admin._id };
      } else {
        admin = { ...data.admin };
      }
      // console.log('admin added data: ', admin);
      delete admin.token;
      dispatch(loginSuccess(admin, message));
    } else {
      dispatch(apiError(message));
    }
  } catch (error) {
    // console.log('authCookies');
    dispatch(apiError(error.message));
  }
};

export const setAdmin = (admin) => (dispatch) => {
  dispatch({
    type: SET_ADMIN,
    payload: admin,
  });
};
