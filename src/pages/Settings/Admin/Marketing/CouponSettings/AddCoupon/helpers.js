import moment from 'moment';

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
});

export const couponDiscountTypeOptions = [
  { label: 'Amount', value: 'fixed' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Free delivery', value: 'free_delivery' },
];

export const checkedInit = {
  couponAmountLimit: true,
  couponUserLimit: true,
  couponOrderLimit: true,
  couponMinimumOrderValue: true,
};

export const validateCoupon = () => ({ status: true });

export const createCouponUploaData = (coupon, checked, couponType) => {
  const { couponAmountLimit, couponUserLimit, couponOrderLimit, couponMinimumOrderValue } = coupon;

  const data = {
    couponAmountLimit: checked.couponAmountLimit ? couponAmountLimit : 0,
    couponUserLimit: checked.couponUserLimit ? couponUserLimit : 0,
    couponOrderLimit: checked.couponOrderLimit ? couponOrderLimit : 0,
    couponMinimumOrderValue: checked.couponMinimumOrderValue ? couponMinimumOrderValue : 0,
  };

  if (couponType === 'individual_store') {
    data.couponShops = coupon?.couponShops?.map((shop) => shop?._id);
  }

  if (couponType === 'individual_user') {
    data.couponShops = coupon?.couponUsers?.map((shop) => shop?._id);
  }

  return {
    ...coupon,
    ...data,
  };
};

export const getCouponEditdData = (editCoupon) => editCoupon;

export const getEditCouponChecked = (editCoupon) => {
  const checked = { ...checkedInit };

  if (!editCoupon?.couponAmountLimit) checked.couponAmountLimit = false;
  if (!editCoupon?.couponUserLimit) checked.couponUserLimit = false;
  if (!editCoupon?.couponOrderLimit) checked.couponOrderLimit = false;
  if (!editCoupon?.couponMinimumOrderValue) checked.couponMinimumOrderValue = false;

  return checked;
};
