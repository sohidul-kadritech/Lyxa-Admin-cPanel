import { successMsg } from '../../helpers/successMsg';

export const varifyUserData = (data) => {
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (!data?.name) {
    successMsg('Please provide admin name');
    return false;
  }
  if (!data?.email) {
    successMsg('Please provide email address');
    return false;
  }
  if (data?.email && !emailRegex.test(data?.email)) {
    successMsg('Invalid email');
    return false;
  }
  if (!data?.password) {
    successMsg('Please provide your password');
    return false;
  }
  if (!data?.confirm_password) {
    successMsg('Please provide your confirm password');
    return false;
  }
  if (data?.confirm_password && data?.password && data?.password !== data?.confirm_password) {
    successMsg('Password not matched');
    return false;
  }
  if (!data?.number) {
    successMsg('Please provide your phone number');
    return false;
  }
  if (!data?.status) {
    successMsg('Select Status');
    return false;
  }
  return true;
};
