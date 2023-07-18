import { isValidPhoneNumber } from 'react-phone-number-input';
import { successMsg } from '../../helpers/successMsg';

export const varifyUserData = (data, isEdit) => {
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
  if (!data?.password && !isEdit) {
    successMsg('Please provide your password');
    return false;
  }
  if (!data?.confirm_password && !isEdit) {
    successMsg('Please provide your confirm password');
    return false;
  }
  if (data?.confirm_password && data?.password && data?.password !== data?.confirm_password && !isEdit) {
    successMsg('Password not matched');
    return false;
  }
  if ((data?.confirm_password || data?.password) && data?.password !== data?.confirm_password && isEdit) {
    successMsg('Password not matched');
    return false;
  }
  if (!data?.number) {
    successMsg('Please provide your phone number');
    return false;
  }

  if (!isValidPhoneNumber(data?.number)) {
    successMsg('Provide Valid phone number');
    return false;
  }
  if (!data?.status) {
    successMsg('Select Status');
    return false;
  }
  return true;
};
export const generateData = (data, isEdit) => {
  delete data.confirm_password;
  if (isEdit) {
    return {
      ...data,
      id: data?._id,
      password: data?.password ? data.password : '',
    };
  }

  return {
    ...data,
  };
};

export const getActiveSellers = (value, oldList) => {
  console.log('value===>', value, oldList);
  if (oldList.includes(value)) {
    return oldList.filter((oldvalue) => oldvalue !== value);
  }

  return [...oldList, value];
};

export const isItActiveOrNot = (value, oldList) => {
  if (oldList.includes(value)) {
    return true;
  }
  return false;
};

export const getManagerSellerIds = (data) => {
  if (data?.length) return data.map((value) => value._id);
  return [];
};
