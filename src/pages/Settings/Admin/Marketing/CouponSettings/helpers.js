import { dateRangeInit } from '../../../../../helpers/dateRangeInit';

export const breadcrumbItems = [
  { label: 'Settings', to: '/admin/settings2' },
  { label: 'Marketing', to: '/admin/settings2/marketing' },
  { label: 'Coupons', to: '#' },
];

export const tabValueToCouponTypeMap = { 0: 'global', 1: 'individual_store', 2: 'individual_user', 3: 'custom_coupon' };

export const filtersInit = {
  searchKey: '',
  couponType: 'global',
  couponStatus: 'active',
  page: 1,
  pageSize: 500,
  pagingRange: 500,
  sortBy: 'desc',
  date: {
    ...dateRangeInit,
  },
};

export const sortOptions = [
  {
    value: 'desc',
    label: 'DESC',
  },
  {
    value: 'asc',
    label: 'ASC',
  },
];

export const statusOptions = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
];
