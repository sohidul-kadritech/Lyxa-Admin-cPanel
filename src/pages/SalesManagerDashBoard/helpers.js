import { isValidPhoneNumber } from 'react-phone-number-input';
import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';

export const staticSellers = [
  {
    _id: '1',
    name: 'All Sellers',
  },
  {
    _id: '2',
    name: 'Sohidul.Co',
  },
  {
    _id: '3',
    name: 'Adam Seller',
  },
];

export const generateData = async (data, isEdit) => {
  delete data.confirm_password;

  const profile_photo = await getImageUrl(data.profile_photo[0]);

  if (!profile_photo) {
    return {
      status: false,
      msg: 'Error uploading profile image!',
    };
  }
  if (isEdit) {
    return {
      ...data,
      profile_photo,
      id: data?._id,
      password: data?.password ? data.password : '',
    };
  }

  return {
    ...data,
    profile_photo,
  };
};

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
  if (!data?.address) {
    successMsg('Provide address!');
    return false;
  }
  if (!data?.profile_photo?.length) {
    successMsg('Provide profile photo');
    return false;
  }
  if (!data?.status) {
    successMsg('Select Status');
    return false;
  }
  return true;
};
