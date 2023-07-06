import moment from 'moment';
import { dateRangeInit } from '../../../../../helpers/dateRangeInit';

export const breadcrumbItems = [
  { label: 'Settings', to: '/settings' },
  { label: 'Marketing', to: '/settings/marketing' },
  { label: 'Coupons', to: '#' },
];

export const tabValueToCouponTypeMap = { 0: 'global', 1: 'individual_store', 2: 'individual_user', 3: 'custom_coupon' };

export const couponListTabOptions = [
  { label: 'Global', value: 'global' },
  { label: 'Store/Category', value: 'individual_store' },
  { label: 'Individual User', value: 'individual_user' },
  { label: 'Custom Coupon', value: 'custom_coupon' },
];

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
    label: 'Desc',
  },
  {
    value: 'asc',
    label: 'Asc',
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
  {
    value: '',
    label: 'All',
  },
];

export const getFormatedDuration = (start, end) => {
  // Convert strings to moment objects
  const startDate = moment(start);
  const endDate = moment(end);

  // Calculate the difference between dates in days
  const duration = moment.duration(endDate.add(1, 's').diff(startDate));

  // Convert days into months, weeks, and days
  const months = Math.floor(duration.asMonths());
  const weeks = Math.floor(duration.asWeeks()) % 4;
  const days = Math.floor(duration.asDays()) % 7;
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;

  const durationArr = [];

  if (months > 0) {
    durationArr.push(`${months} month${months === 1 ? '' : 's'}`);
  }

  if (weeks > 0) {
    durationArr.push(`${weeks} week${weeks === 1 ? '' : 's'}`);
    if (durationArr.length === 2) return durationArr.join(' ');
  }

  if (days > 0) {
    durationArr.push(`${days} day${days === 1 ? '' : 's'}`);
    if (durationArr.length === 2) return durationArr.join(' ');
  }

  if (hours > 0) {
    durationArr.push(`${hours} hour${hours === 1 ? '' : 's'}`);
    if (durationArr.length === 2) return durationArr.join(' ');
  }

  if (minutes > 0) {
    durationArr.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
    if (durationArr.length === 2) return durationArr.join(' ');
  }

  if (durationArr.length === 0) {
    return null;
  }

  return durationArr.join(' ');
};
