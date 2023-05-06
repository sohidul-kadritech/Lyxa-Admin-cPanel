import moment from 'moment';

export const couponTypeToTitleMap = {
  global: 'Global',
  individual_store: 'Store',
  individual_user: 'User',
  custom_coupon: 'Custom',
};

export const getCouponInit = (couponType) => ({
  couponType,
  couponStatus: '',
  couponName: '',
  couponDiscountType: '',
  couponValue: 25,
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

export const createCouponUploaData = (coupon, checked) => {
  const { couponAmountLimit, couponUserLimit, couponOrderLimit, couponMinimumOrderValue } = coupon;

  const data = {
    couponAmountLimit: checked.couponAmountLimit ? couponAmountLimit : 0,
    couponUserLimit: checked.couponUserLimit ? couponUserLimit : 0,
    couponOrderLimit: checked.couponOrderLimit ? couponOrderLimit : 0,
    couponMinimumOrderValue: checked.couponMinimumOrderValue ? couponMinimumOrderValue : 0,
  };

  return {
    ...coupon,
    ...data,
  };
};
