import { successMsg } from '../../helpers/successMsg';

export const activeStatusOptions = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
];

export const accountTypeOptionsFilter = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'shop',
    label: 'Shop',
  },
  {
    value: 'deliveryBoy',
    label: 'Delivery Boy',
  },
];

export const accountTypeOptionsAdd = [
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'shop',
    label: 'Shop',
  },
  {
    value: 'deliveryBoy',
    label: 'Delivery Boy',
  },
];
export const notificationTypeOptionsFilter = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'global',
    label: 'Global',
  },
  {
    value: 'specific',
    label: 'Specific',
  },
];
export const notificationTypeOptionsAdd = [
  {
    value: 'global',
    label: 'Global',
  },
  {
    value: 'specific',
    label: 'Specific',
  },
];

export const notificationDataValidation = (data) => {
  console.log('data: ', data);
  if (!data.title) {
    successMsg("Notification title can't be empty!");
    return false;
  }
  if (!data.description) {
    successMsg("Notification description can't be empty!");
    return false;
  }
  if (!data.accountType) {
    successMsg('Please select an account type!');
    return false;
  }

  if (!data.type) {
    successMsg('Please select notification type!');
    return false;
  }
  if (data.type === 'specific') {
    if (data.shop === null && data.accountType === 'shop') {
      successMsg('Please select a shop!');
      return false;
    }
    if (data.user === null && data.accountType === 'user') {
      successMsg('Please select a user!');
      return false;
    }
    if (data.deliveryMan === null && data.accountType === 'delivery_boy') {
      successMsg('Please select a rider!');
      return false;
    }
  }
  return true;
};

export const generateData = (data) => {
  const notificationData = {
    title: data?.title,
    description: data?.description,
    accountType: data?.accountType,
    type: data?.type,
  };
  if (data.accountType === 'shop') {
    return {
      ...notificationData,
      shop: data.shop,
    };
  }
  if (data.accountType === 'user') {
    return {
      ...notificationData,
      user: data.user,
    };
  }
  if (data.accountType === 'delivery_boy') {
    return {
      ...notificationData,
      deliveryBoy: data.deliveryBoy,
    };
  }

  return notificationData;
};
