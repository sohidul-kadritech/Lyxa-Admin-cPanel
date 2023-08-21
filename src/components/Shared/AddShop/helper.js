import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { deepClone } from '../../../helpers/deepClone';
import { getImageUrl } from '../../../helpers/images';
import { successMsg } from '../../../helpers/successMsg';

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
];

export const receivePaymentByOptions = [
  { label: 'Bank', value: 'bank' },
  { label: 'Cash', value: 'cash' },
];

export const getShopEditData = (shop) => {
  const clone = deepClone(shop);
  return {
    ...clone,
    phone_number: parsePhoneNumber(shop?.phone_number) ? shop?.phone_number : `+961${shop?.phone_number}`,
    shopAddress: clone?.address,
    password: '',
    shopLogo: [{ preview: shop.shopLogo }],
    shopBanner: [{ preview: shop.shopBanner }],
    liveStatus: undefined,
  };
};

export const validateShopDetails = (shopData, isEditShop, adminType) => {
  console.log(shopData);

  const status = {
    status: false,
    msg: null,
  };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (!shopData?.shopName?.trim()) {
    status.msg = 'Please provide shop name';
    return status;
  }
  if (!shopData?.name?.trim()) {
    status.msg = 'Please provide shop manager name';
    return status;
  }

  if (!shopData?.email?.trim()) {
    status.msg = 'Please provide shop email';
    return status;
  }

  if (shopData?.email && !emailRegex.test(shopData?.email)) {
    status.msg = 'Email is not valid';
    return status;
  }

  if (!shopData?.password && !isEditShop) {
    status.msg = 'Please provide shop password';
    return status;
  }

  if (shopData?.password?.length && shopData?.password?.length < 6) {
    status.msg = 'Password must be at least 6 characters';
    return status;
  }

  if (!shopData?.phone_number) {
    status.msg = 'Please provide shop phone number';
    return status;
  }

  if (!isValidPhoneNumber(shopData?.phone_number)) {
    status.msg = 'Please provide valid phone number';
    return status;
  }
  if (!shopData?.shopAddress?.address) {
    status.msg = 'Please provide shop address';
    return status;
  }

  if (!shopData?.shopAddress?.pin) {
    status.msg = 'Please provide shop Zip Code';
    return status;
  }

  if (!shopData?.shopLogo?.length) {
    status.msg = 'Please provide Shop logo';
    return status;
  }

  if (!shopData?.shopBanner.length) {
    status.msg = 'Please provide shop Shop Banner';
    return status;
  }

  if (!shopData?.shopStatus && adminType === 'admin') {
    status.msg = 'Please Select shop Shop Status';
    return status;
  }

  if (!shopData?.shopZone) {
    successMsg("You don't have a zone assigned to this shop.");
    return { ...status, status: true };
  }

  return { status: true };
};

export const validateShopFeatures = (shopData, sellerType) => {
  const status = {
    status: false,
    msg: null,
  };

  if (!shopData?.expensive) {
    status.msg = 'Please Select shop Price Range';
    return status;
  }

  if (!shopData?.deliveryType === 'self' && !shopData?.deliveryFee) {
    status.msg = 'Please add shop delivery fee';
    return status;
  }

  if (!shopData?.minOrderAmount || Number(shopData?.minOrderAmount) < 1) {
    status.msg = 'Please add valid minimum order admount';
    return status;
  }

  if (!shopData?.paymentOption?.length) {
    status.msg = 'Please select at least one payment option';
    return status;
  }

  if (!shopData?.tags?.length) {
    status.msg = 'Please select at least one tag';
    return status;
  }

  if (!shopData?.cuisineType?.length && sellerType === 'food') {
    status.msg = 'Please select at least one cuisine option';
    return status;
  }

  return { status: true };
};

export const validateBankDetails = (shopData) => {
  const status = {
    status: false,
    msg: null,
  };

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
};

export const createEditShopData = async (shopData) => {
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

  console.log('shopData?.shopZone', shopData?.shopZone);

  return {
    id: shopData?._id,
    shopName: shopData?.shopName,
    shopBrand: shopData?.shopBrand,
    name: shopData?.name,
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
    shopAddress: shopData?.shopAddress,
    shopZone: shopData?.shopZone,
    shopLogo,
    shopBanner,
    shopReceivePaymentBy: shopData?.shopReceivePaymentBy,
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
    tags.push(tag?.name);
    tagsId.push(tag?._id);
  });

  shopData?.cuisineType?.forEach((cuisine) => {
    cuisineType.push(cuisine?._id);
  });

  const isCuisine = cuisineType?.length > 0;

  return { ...shopData, tags, cuisineType, isCuisine, tagsId, shopBanner, shopLogo };
};

export const updateShopData = (oldShop, newShop) => {
  oldShop.address = newShop?.address || oldShop?.address;
  oldShop.shopName = newShop?.shopName || oldShop?.shopName;
  oldShop.email = newShop?.email || oldShop?.email;
  oldShop.password = newShop?.password || oldShop?.password;
  oldShop.phone_number = newShop?.phone_number || oldShop?.phone_number;
  oldShop.shopLogo = newShop?.shopLogo || oldShop?.shopLogo;
  oldShop.shopBanner = newShop?.shopBanner || oldShop?.shopBanner;
  oldShop.shopStatus = newShop?.shopStatus || oldShop?.shopStatus;
  oldShop.bank_name = newShop?.bank_name || oldShop?.bank_name;
  oldShop.account_number = newShop?.account_number || oldShop?.account_number;
  oldShop.bank_postal_code = newShop?.bank_postal_code || oldShop?.bank_postal_code;
  oldShop.bank_address = newShop?.bank_address || oldShop?.bank_address;
  oldShop.account_swift = newShop?.account_swift || oldShop?.account_swift;
  oldShop.shopZone = newShop?.shopZone || oldShop?.shopZone;
};

export const shopNormalHours = [
  {
    day: 'Monday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Tuesday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
  {
    day: 'Wednesday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
  {
    day: 'Thursday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
  {
    day: 'Friday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
  {
    day: 'Saturday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
  {
    day: 'Sunday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: true,
  },
];

export const shopInit = (sellerId) => ({
  seller: sellerId,
  shopName: '',
  password: '',
  isCuisine: false,
  minOrderAmount: 1,
  email: '',
  phone_number: '',
  shopType: '',
  shopLogo: [],
  shopBanner: [],
  shopStatus: 'active',
  shopDescription: '',
  tags: [],
  tagsId: [],
  orderCapacity: 0,
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
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    country: '',
    placeId: '',
    pin: '',
    primary: true,
    note: '',
  },
  normalHours: shopNormalHours,
  shopReceivePaymentBy: 'bank',
  bank_name: '',
  account_name: '',
  account_number: '',
  bank_address: '',
  bank_postal_code: '',
  account_swift: '',
});

export const getZoneDataFromLatLng = (zones = []) => {
  if (zones.length) {
    successMsg(`${zones.length} zones found in this area`, 'success');
    return zones.map((zone) => ({ label: zone?.zoneName, value: zone?._id }));
  }

  successMsg('No zone found in this area!');

  return [{ label: 'No zone found', value: null }];
};

export const getShopZoneData = (data, zones) => {
  if (zones[0]?.label === 'No zone found' && zones[0].value === null) {
    return undefined;
  }

  if (data?._id) return data?._id;

  if (data) {
    return data;
  }
  return '';
};
