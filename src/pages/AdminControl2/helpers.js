/* eslint-disable max-len */
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

export const getTeamPermissionText = (adminType) => {
  const text = {
    admin: '*Super Admin has full access.',
    customerService:
      '*Access to the pages for riders, users, and sellers, as well as to Manage orders and Customer Support (chat), with the exception of those related to payments, edit, tax, marketing, and settings.',
    sales:
      '*Access to only those seller pages and shops related to each seller for this sales manager that were added by Lyxa or the sales manager himself, excluding pages for payments, taxes, marketing, and settings. (Sales managers are able to create sellers and shops)',
    accountManager:
      "*Account Manager only has access to the sellers' pages that the admin has specifically assigned to them. (Account manager is unable to add sellers.), except for those related to payments, tax, marketing, and settings. (Although the account manager cannot create sellers, they can only edit existing sellers and create shops that are related to each seller that was given to them.)",
  };

  return text[adminType];
};
