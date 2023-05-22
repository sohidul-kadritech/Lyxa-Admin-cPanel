import { deepClone } from '../../../helpers/deepClone';
import { getImageUrl } from '../../../helpers/images';

export const priceRangeOptions = [
  { label: '$', value: 1 },
  { label: '$$', value: 2 },
  { label: '$$$', value: 3 },
  { label: '$$$$', value: 4 },
];

export const paymentOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'POS', value: 'pos' },
  { label: 'Card', value: 'card' },
  { label: 'Wallet', value: 'wallet' },
];

export const deliveryOptions = [
  { label: 'Store', value: 'self' },
  { label: 'Lyxa', value: 'drop' },
];

export const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Blocked',
    value: 'blocked',
  },
];

export const getShopEditData = (shop) => ({
  ...deepClone(shop),
  password: '',
  shopLogo: [{ preview: shop.shopLogo }],
  shopBanner: [{ preview: shop.shopBanner }],
});

export function validateShop(shopData, isEditShop) {
  const status = {
    status: false,
    msg: null,
  };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (!shopData?.email?.trim()) {
    status.msg = 'Please provide your email';
    return status;
  }
  if (shopData?.email && !emailRegex.test(shopData?.email)) {
    status.msg = 'Email is not valid';
    return status;
  }

  if (!shopData?.password && !isEditShop) {
    status.msg = 'Please provide your password first';
    return status;
  }

  if (shopData?.password?.length && shopData?.password?.length < 6) {
    status.msg = 'Password must be at least 6 characters';
    return status;
  }

  if (!shopData?.phone_number) {
    status.msg = 'Please provide your phone number';
    return status;
  }

  if (!shopData?.address) {
    status.msg = 'Please provide your phone number';
    return status;
  }

  if (!shopData?.address?.pin) {
    status.msg = 'Please provide your Zip Code';
    return status;
  }

  if (!shopData?.shopLogo) {
    status.msg = 'Please provide your Shop logo';
    return status;
  }

  if (!shopData?.shopBanner) {
    status.msg = 'Please provide your Shop Banner';
    return status;
  }

  if (!shopData?.shopStatus) {
    status.msg = 'Please Select your Shop Status';
    return status;
  }

  if (!shopData?.expensive) {
    status.msg = 'Please Select Shop Price Range';
    return status;
  }

  if (!shopData?.deliveryType === 'self' && !shopData?.deliveryFee) {
    status.msg = 'Please add shop delivery fee';
    return status;
  }

  if (!shopData?.minOrderAmount) {
    status.msg = 'Please add minimum order admount';
    return status;
  }

  if (!shopData?.paymentOption?.length) {
    status.msg = 'Please select at least one payment option';
    return status;
  }

  if (!shopData?.tags?.length) {
    status.msg = 'Please select at least one tag or cuisine option';
    return status;
  }

  if (!shopData?.bank_name) {
    status.msg = 'Please provide your bank account';
    return status;
  }

  if (!shopData?.account_name) {
    status.msg = 'Please provide your bank account name';
    return status;
  }

  if (!shopData?.bank_address) {
    status.msg = 'Please provide your bank address';
    return status;
  }

  if (!shopData?.bank_postal_code) {
    status.msg = 'Please provide your bank postal code';
    return status;
  }

  if (!shopData?.account_number) {
    status.msg = 'Please provide your bank account number';
    return status;
  }

  if (!shopData?.account_swift) {
    status.msg = 'Please provide your bank swift';
    return status;
  }

  return { status: true };
}

export const createEditShopData = async (shopData) => {
  const img_url_logo = await getImageUrl(shopData.shopLogo[0]);
  const img_url_banner = await getImageUrl(shopData.shopBanner[0]);

  if (!img_url_logo) {
    return {
      status: false,
      msg: 'Error uploading shop logo image!',
    };
  }
  if (!img_url_banner) {
    return {
      status: false,
      msg: 'Error uploading shop banner image',
    };
  }

  shopData.shopAddress = shopData.address;
  delete shopData.address;

  return {
    id: shopData?._id,
    shopName: shopData?.shopName,
    email: shopData?.email,
    password: shopData?.password,
    phone_number: shopData?.phone_number,
    shopStatus: shopData?.shopStatus,
    bank_name: shopData?.bank_name,
    account_name: shopData?.account_name,
    account_number: shopData?.account_number,
    bank_address: shopData?.bank_address,
    bank_postal_code: shopData?.bank_postal_code,
    account_swift: shopData?.account_swift,
    shopAddress: {
      address: shopData?.shopAddress?.address,
      latitude: shopData?.shopAddress?.latitude,
      longitude: shopData?.shopAddress?.longitude,
      country: shopData?.shopAddress?.country,
      state: shopData?.shopAddress?.state,
      city: shopData?.shopAddress?.city,
      pin: shopData?.shopAddress?.pin,
      primary: false,
      note: shopData?.shopAddress?.note,
    },
    shopLogo: img_url_logo,
    shopBanner: img_url_banner,
  };
};

export const createAddShopData = async (shopData) => {
  const shopLogo = await getImageUrl(shopData.shopLogo[0]);
  const shopBanner = await getImageUrl(shopData.shopBanner[0]);

  if (!shopLogo) {
    return {
      status: false,
      msg: 'Error uploading shop logo image!',
    };
  }

  if (!shopBanner) {
    return {
      status: false,
      msg: 'Error uploading shop banner image',
    };
  }

  const tags = [];
  const cuisineType = [];
  const tagsId = [];

  shopData?.tags?.forEach((tag) => {
    if (tag?.type === 'tag') {
      tags.push(tag?.name);
      tagsId.push(tag?._id);
    } else {
      cuisineType.push(tag?._id);
    }
  });

  return { ...shopData, tags, cuisineType, tagsId, shopBanner, shopLogo };
};

export const updateShopData = (oldShop, newShop) => {
  oldShop.address = newShop?.address || oldShop?.address;
  oldShop.shopName = newShop?.shopName || oldShop?.shopName;
  oldShop.email = newShop?.email || oldShop?.email;
  oldShop.password = newShop?.password || oldShop?.password;
  oldShop.phone_number = newShop?.phone_number || oldShop?.phone_number;
  oldShop.shopLogo = newShop?.shopLogo || oldShop?.shopLogo;
  oldShop.shopBanner = newShop?.shopBanner || oldShop?.shopBanner;
  oldShop.status = newShop?.status || oldShop?.status;
  oldShop.bank_name = newShop?.bank_name || oldShop?.bank_name;
  oldShop.account_number = newShop?.account_number || oldShop?.account_number;
  oldShop.bank_postal_code = newShop?.bank_postal_code || oldShop?.bank_postal_code;
  oldShop.bank_address = newShop?.bank_address || oldShop?.bank_address;
  oldShop.account_swift = newShop?.account_swift || oldShop?.account_swift;
};

const shopNoramalHours = [
  {
    day: 'Monday',
    open: '12:00',
    close: '23:00',
    isActive: false,
  },
  {
    day: 'Tuesday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
  {
    day: 'Wednesday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
  {
    day: 'Thursday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
  {
    day: 'Friday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
  {
    day: 'Saturday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
  {
    day: 'Sunday',
    open: '12:00',
    close: '23:00',
    isActive: true,
  },
];

export const shopInit = (sellerId) => ({
  seller: sellerId,
  shopStartTime: '10:00',
  shopEndTime: '20:00',
  shopName: '',
  password: '',
  isCuisine: false,
  minOrderAmount: '',
  email: '',
  phone_number: '',
  shopType: '',
  shopLogo: [],
  shopBanner: [],
  shopStatus: '',
  shopDescription: '',
  tags: [],
  tagsId: [],
  orderCapacity: '',
  paymentOption: [],
  liveStatus: 'online',
  cuisineType: [],
  dietaryType: [],
  expensive: '',
  deliveryType: 'drop',
  deliveryFee: 0,
  shopNote: '',
  shopAddress: {
    address: '',
    latitude: 23.7820624,
    longitude: 90.4160527,
    city: 'Dhaka',
    state: 'Gulshan',
    country: 'Bangladesh',
    placeId: 'ChIJq07Cv57HVTcRekUSP1arfeo',
    pin: '',
    primary: true,
    note: '',
  },
  normalHours: shopNoramalHours,
  bank_name: '',
  account_name: '',
  account_number: '',
  bank_address: '',
  bank_postal_code: '',
  account_swift: '',
});
