import moment from 'moment';

export const filterCoupons = (coupons, filter) => {
  if (filter === 'active') return coupons?.filter((coupon) => coupon?.couponStatus === 'active');
  if (filter === 'expired')
    return coupons?.filter((coupon) => moment().endOf('day').isAfter(coupon?.couponDuration?.end));
  return coupons;
};
