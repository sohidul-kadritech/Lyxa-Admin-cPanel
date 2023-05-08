import moment from 'moment';
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

export const getFormatedDuration = (start, end) => {
  // Convert strings to moment objects
  const startDate = moment(start);
  const endDate = moment(end);

  // Calculate the difference between dates in days
  const duration = moment.duration(endDate.diff(startDate));

  // Convert days into months, weeks, and days
  const months = Math.floor(duration.asMonths());
  const weeks = Math.floor(duration.asWeeks()) % 4;
  let days = Math.floor(duration.asDays()) % 7;
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;

  // Build a string that represents the duration
  let durationStr = '';

  if (months) {
    durationStr = `${months} month${months === 1 ? '' : 's'}`;

    if (weeks) {
      durationStr += ` ${weeks} week${weeks === 1 ? '' : 's'}`;
    }

    return durationStr;
  }

  if (weeks) {
    durationStr += ` ${weeks} week${weeks === 1 ? '' : 's'}`;
    days = Math.ceil(duration.asDays()) % 7;

    if (days) {
      durationStr += ` ${days} day${days === 1 ? '' : 's'}`;
    }

    return durationStr;
  }

  if (days || hours) {
    if (days) {
      durationStr += ` ${days} day${days === 1 ? '' : 's'}`;
    }

    if (hours) {
      durationStr += ` ${hours} hour${hours === 1 ? '' : 's'}`;
    }

    return durationStr;
  }

  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
};
