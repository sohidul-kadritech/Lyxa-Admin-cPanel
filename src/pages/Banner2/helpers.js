import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';

export const clickableOption = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];
export const clickableLinkOption = [
  {
    label: 'Link',
    value: 'link',
  },
  {
    label: 'Shop',
    value: 'shop',
  },
  {
    label: 'Product',
    value: 'product',
  },
];

export const shopTypeOptions = [
  {
    label: 'Food',
    value: 'food',
  },
  {
    label: 'Grocery',
    value: 'grocery',
  },
  {
    label: 'Pharmacy',
    value: 'pharmacy',
  },
];
const clickTypeValidation = (data) => {
  if (data?.clickType === 'link' && !data?.clickableUrl) {
    successMsg('Please provide url!');
    return false;
  }
  if (data?.clickType === 'shop' && !data?.shopIdForClickGo) {
    successMsg('Please select a shop!');
    return false;
  }
  if (data?.clickType === 'product' && !data?.productId) {
    successMsg('Please select a product!');
    return false;
  }

  return true;
};

export const BannerDataValidation = (data, type) => {
  if (!data?.type) {
    successMsg('Please provide add type!');
    return false;
  }
  if (!data?.title) {
    successMsg('Please provide title!');
    return false;
  }
  if (!data?.image) {
    successMsg('Please provide banner!');
    return false;
  }
  if (!data?.isClickable && type === 'home') {
    successMsg('Select the url is clickable or not!');
    return false;
  }
  if (!data?.clickType && type === 'home') {
    successMsg('Select the click type!');
    return false;
  }

  if (!clickTypeValidation(data) && type === 'home') {
    return false;
  }

  return true;
};

export const generateData = async (data, type) => {
  const image = await getImageUrl(data?.image[0]);
  if (!image) {
    successMsg('Error, when image is uploading!');
    return false;
  }
  const readyData = {
    title: data?.title,
    image,
    type: data?.type,
    isClickable: data?.isClickable === 'yes',
    clickType: data?.clickType,
    // shopId: '',
    // clickableUrl: '',
    // productId: '62b303718d5416101a12be6e',
    // shopIdForClickGo: '',
  };

  if (data?.clickType === 'link' && type === 'home') {
    return { ...readyData, clickType: '', clickableUrl: data?.clickableUrl };
  }
  if (data?.clickType === 'shop' && type === 'home') {
    return { ...readyData, shopIdForClickGo: data?.shopIdForClickGo?._id };
  }
  if (data?.clickType === 'product' && type === 'home') {
    return { ...readyData, productId: data?.productId?._id };
  }

  return readyData;
};
