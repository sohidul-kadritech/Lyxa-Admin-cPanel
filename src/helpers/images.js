import * as Api from '../network/Api';
import AXIOS from '../network/axios';
import { successMsg } from './successMsg';

// upload image to server
export const uploadImage = async (image) => {
  const fdata = new FormData();
  fdata.append('image', image);

  try {
    const { data } = await AXIOS.post(Api.IMAGE_UPLOAD, fdata);
    return data;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: error?.message,
    };
  }
};

// upload image or existing return url
export const getImageUrl = async (image) => {
  if (!image?.name) {
    return image?.preview;
  }

  const data = await uploadImage(image);
  console.log(data);

  if (data?.url) {
    return data?.url;
  }

  successMsg(data.message, 'error');
  console.log(data.message);

  return null;
};
