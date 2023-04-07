import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

// upload image to server
const uploadImage = async (image) => {
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
const getImageUrl = async (image) => {
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

export const createContainerData = async (container, containerType, shopType) => {
  if (!container?.name?.trim()) {
    successMsg('Name cannot be empty!');
    return null;
  }

  if (containerType === 'list' && container?.image?.length < 1) {
    successMsg('Image is required!');
    return null;
  }

  if (containerType === 'list' && container?.banner?.length < 1) {
    successMsg('Banner is required!');
    return null;
  }

  const type = {
    deal: false,
    tag: false,
    shop: false,
  };

  const data = {};
  data.name = container.name;

  data.deals = container.deals.map((item) => {
    type.deal = true;
    return item.value;
  });

  data.tags = container.tags.map((item) => {
    type.tag = true;
    return item._id;
  });

  data.shops = container.shops.map((item) => {
    type.shop = true;
    return item._id;
  });

  data.type = Object.entries(type)
    .filter((item) => item[1])
    .map((item) => item[0]);

  if (data?.type.length === 0) {
    successMsg(
      containerType === 'list' ? 'Please select atleast one of Deal, Shop or Tag!' : 'Please select deals first'
    );
    return null;
  }

  data.shopType = shopType;

  if (containerType === 'list') {
    data.image = await getImageUrl(container?.image[0]);
    data.banner = await getImageUrl(container?.banner[0]);

    console.log(data);

    if (!data.image || !data.banner) {
      return null;
    }
  }

  return data;
};
