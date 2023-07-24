import moment from 'moment';
import { deepClone } from '../../../helpers/deepClone';

export const couponTypeToTitleMap = {
  global: 'Global',
  individual_store: 'Store/Category',
  individual_user: 'User',
  custom_coupon: 'Custom',
};

export const getCouponInit = (couponType) => ({
  couponType,
  couponStatus: 'active',
  couponName: '',
  couponDiscountType: '',
  couponValue: '',
  couponDuration: {
    start: moment(),
    end: moment().add(7, 'd'),
  },
  couponAmountLimit: 0,
  couponUserLimit: 0,
  couponOrderLimit: 0,
  couponMinimumOrderValue: 0,
  couponInfluencer: couponType === 'custom_coupon' ? '' : undefined,
  couponUsers: [],
  couponShops: [],
  couponShopTypes: couponType === 'global' ? undefined : [],
});

export const couponDiscountTypeOptions = [
  { label: 'Amount', value: 'fixed' },
  { label: 'Percentage', value: 'percentage' },
];

export const couponShopTypeOptions = [
  { label: 'Resturant', value: 'food' },
  { label: 'Grocery', value: 'grocery' },
  { label: 'Pharmacy', value: 'pharmacy' },
];

export const checkedInit = {
  couponAmountLimit: false,
  couponUserLimit: false,
  couponOrderLimit: false,
  couponMinimumOrderValue: false,
};

export const validateCoupon = (coupon, couponType) => {
  const error = {
    status: false,
    message: '',
  };

  if (!coupon?.couponName?.trim()) {
    error.message = 'Coupon name cannot be empty!';
    return error;
  }

  if (!coupon?.couponDiscountType) {
    error.message = 'Coupon type cannot be empty!';
    return error;
  }

  if (!coupon?.couponValue) {
    error.message = 'Coupon value cannot be empty!';
    return error;
  }

  if (couponType === 'individual_store') {
    if (!coupon?.couponShops?.length && !coupon?.couponShopTypes?.length) {
      error.message = 'Must have cuopon shop category or custom shop!';
      return error;
    }
  }

  if (couponType === 'individual_user') {
    if (!coupon?.couponUsers?.length) {
      error.message = 'Coupon user cannot be empty!';
      return error;
    }
  }

  if (couponType === 'custom_coupon') {
    if (!coupon?.couponInfluencer) {
      error.message = 'Please select cuopon influencer';
      return error;
    }

    if (!coupon?.couponShops?.length && !coupon?.couponShopTypes?.length) {
      error.message = 'Must have cuopon shop category or custom shop!';
      return error;
    }
  }

  return { status: true };
};

export const createCouponUploaData = (coupon, checked) => {
  const data = {};

  data.couponShops = coupon?.couponShops?.map((shop) => shop?._id);
  data.couponUsers = coupon?.couponUsers?.map((shop) => shop?._id);
  data.couponInfluencer = coupon.couponInfluencer?._id;

  // limits
  Object.entries(checked).forEach(([key, value]) => {
    if (!value || !Number(coupon[key])) {
      data[key] = 0;
    }
  });

  return {
    ...coupon,
    ...data,
  };
};

export const getCouponEditdData = (editCoupon) => {
  console.log(editCoupon);
  const coupon = deepClone(editCoupon);
  return coupon;
};

export const getEditCouponChecked = (editCoupon) => {
  const checked = { ...checkedInit };
  if (editCoupon?.couponAmountLimit > 0) checked.couponAmountLimit = true;
  if (editCoupon?.couponUserLimit > 0) checked.couponUserLimit = true;
  if (editCoupon?.couponOrderLimit > 0) checked.couponOrderLimit = true;
  if (editCoupon?.couponMinimumOrderValue > 0) checked.couponMinimumOrderValue = true;
  return checked;
};
