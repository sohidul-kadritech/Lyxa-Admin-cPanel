import moment from 'moment';
import { getImageUrl } from '../../../helpers/images';

export const createEditUserData = (editUser) => {
  const profile_photo = [];

  if (editUser?.profile_photo) {
    profile_photo?.push({ preview: editUser?.profile_photo });
  }

  return {
    ...editUser,
    id: editUser._id,
    profile_photo,
  };
};

export const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export const validateUser = (user) => {
  const status = { status: false, message: '' };

  if (!user?.name?.trim()) {
    status.message = 'Name can not empty';
    return status;
  }

  return {
    status: true,
  };
};

export const creatUserData = async (user) => {
  const hasImage = !!user?.profile_photo[0];
  let photoUrl;

  if (hasImage) {
    photoUrl = await getImageUrl(user?.profile_photo[0]);

    if (!photoUrl) {
      return {
        error: true,
        message: 'Error while uploading image',
      };
    }
  }

  return {
    name: user?.name?.trim(),
    profile_photo: photoUrl,
    dob: moment(user?.dob).format('YYYY-MM-DD'),
    gender: user?.gender,
    id: user?._id,
  };
};
