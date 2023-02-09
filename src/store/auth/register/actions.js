import { REGISTER_USER, REGISTER_USER_FAILED, REGISTER_USER_SUCCESSFUL } from './actionTypes';

export const registerUser = (user) => ({
  type: REGISTER_USER,
  payload: { user },
});

export const registerUserSuccessful = (user) => ({
  type: REGISTER_USER_SUCCESSFUL,
  payload: user,
});

export const registerUserFailed = (user) => ({
  type: REGISTER_USER_FAILED,
  payload: user,
});
