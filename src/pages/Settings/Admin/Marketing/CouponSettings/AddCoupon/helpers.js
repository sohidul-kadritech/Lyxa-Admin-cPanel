import moment from 'moment';
import { deepClone } from '../../../../../../helpers/deepClone';

export const couponTypeToTitleMap = {
  global: 'Global',
  individual_store: 'Store',
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
  couponAmountLimit: 1,
  couponUserLimit: 1,
  couponOrderLimit: 1,
  couponMinimumOrderValue: 1,
  couponInfluencer: couponType === 'custom_coupon' ? '' : undefined,
  couponUsers: [],
  couponShops: [],
  couponShopTypes: couponType === 'custom_coupon' ? [] : undefined,
});

export const couponDiscountTypeOptions = [
  { label: 'Amount', value: 'fixed' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Free delivery', value: 'free_delivery' },
];

export const couponShopTypeOptions = [
  { label: 'Resturant', value: 'food' },
  { label: 'Grocery', value: 'grocery' },
  { label: 'Pharmacy', value: 'pharmacy' },
];

export const checkedInit = {
  couponAmountLimit: true,
  couponUserLimit: true,
  couponOrderLimit: true,
  couponMinimumOrderValue: true,
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

  if (!coupon?.couponValue && coupon?.couponDiscountType !== 'free_delivery') {
    error.message = 'Coupon value cannot be empty!';
    return error;
  }

  if (couponType === 'individual_store') {
    if (!coupon?.couponShops?.length) {
      error.message = 'Coupon store cannot be empty!';
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
  const { couponAmountLimit, couponUserLimit, couponOrderLimit, couponMinimumOrderValue } = coupon;

  const data = {
    couponAmountLimit: checked.couponAmountLimit ? couponAmountLimit : 0,
    couponUserLimit: checked.couponUserLimit ? couponUserLimit : 0,
    couponOrderLimit: checked.couponOrderLimit ? couponOrderLimit : 0,
    couponMinimumOrderValue: checked.couponMinimumOrderValue ? couponMinimumOrderValue : 0,
  };

  data.couponShops = coupon?.couponShops?.map((shop) => shop?._id);
  data.couponUsers = coupon?.couponUsers?.map((shop) => shop?._id);
  data.couponInfluencer = coupon.couponInfluencer?._id;

  if (coupon?.couponShopTypes?.length) {
    data.couponShopTypes = coupon?.couponShopTypes?.map((item) => item?.value);
    data.couponShops = [];
  }

  return {
    ...coupon,
    ...data,
  };
};

export const getCouponEditdData = (editCoupon) => {
  const coupon = deepClone(editCoupon);
  coupon.couponShopTypes = coupon.couponShopTypes?.map((type) =>
    couponShopTypeOptions.find((item) => item?.value === type)
  );
  // console.log('==========>', coupon);
  return coupon;
};

export const getEditCouponChecked = (editCoupon) => {
  const checked = { ...checkedInit };

  if (!editCoupon?.couponAmountLimit) checked.couponAmountLimit = false;
  if (!editCoupon?.couponUserLimit) checked.couponUserLimit = false;
  if (!editCoupon?.couponOrderLimit) checked.couponOrderLimit = false;
  if (!editCoupon?.couponMinimumOrderValue) checked.couponMinimumOrderValue = false;

  return checked;
};
