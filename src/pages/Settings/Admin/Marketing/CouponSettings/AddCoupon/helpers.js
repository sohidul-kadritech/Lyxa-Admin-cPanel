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
  couponDiscountType: 'fixed',
  couponValue: 25,
  couponDuration: {
    start: moment(),
    end: moment().add(7, 'd'),
  },
  couponAmountLimit: 5000,
  couponUserLimit: 5,
  couponOrderLimit: 100,
  couponMinimumOrderValue: 350,
  // unknwon
  couponInfluencer: '', // only custom coupon
  couponUsers: [''],
  couponShops: [''],
});

export const couponDiscountTypeOptions = [
  { label: 'Amount', value: 'fixed' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Free delivery', value: 'free_delivery' },
];
