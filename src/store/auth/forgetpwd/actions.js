import { FORGET_PASSWORD, FORGET_PASSWORD_ERROR, FORGET_PASSWORD_SUCCESS } from './actionTypes';

export const userForgetPassword = (user, history) => ({
  type: FORGET_PASSWORD,
  payload: { user, history },
});

export const userForgetPasswordSuccess = (message) => ({
  type: FORGET_PASSWORD_SUCCESS,
  payload: message,
});

export const userForgetPasswordError = (message) => ({
  type: FORGET_PASSWORD_ERROR,
  payload: message,
});
