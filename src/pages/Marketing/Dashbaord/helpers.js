/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import moment from 'moment';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';

// third party
export const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

export const dateRangeItit = {
  end: moment(),
  start: getFirstMonday('week'),
};

export const marketingDurationTime = (start, end) => {
  // if campaign ended
  if (moment().isAfter(moment(end))) return 'During campaign';
  const duration = moment().diff(moment(start), 'hours');
  return `${Math.ceil(duration / 24) || 1} days`;
};

export const getMarketingTypeTitle = (type) => {
  const titles = {
    featured: 'Featured',
    double_menu: 'Buy 1, Get 1',
    free_delivery: '$0 Delivery Fee',
    reward: 'Loyalty Points',
    percentage: 'Discount',
  };
  return titles[type];
};

export const isVisibleOngoingPromotionItem = (type) => {
  const types = {
    featured: true,
    double_menu: true,
    free_delivery: false,
    reward: true,
    percentage: true,
  };

  return types[type];
};

// params?.type === 'featured'
//                   ? `${marketingInfoQuery?.data?.data?.summary?.featuredSpentAmount || 0}/${
//                       marketingInfoQuery?.data?.data?.summary?.featuredAmount || 0
//                     }${currency?.symbol}`
//                   : marketingInfoQuery?.data?.data?.summary?.totalPromotionItems || 0
export const getDataForOngoingPromotionItem = (type, data, currency) => {
  const totalSpentFeaturedAmount = data?.featuredSpentAmount;
  const totalFeaturedAmount = data?.featuredAmount;

  if (type === 'featured') {
    return `${totalSpentFeaturedAmount || 0}/${totalFeaturedAmount || 0}${currency?.symbol}`;
  }

  return data?.totalPromotionItems || 0;
};

export const getDurationFromMarketingHistory = (data) => {
  const duration = moment(data?.end).endOf('day').diff(moment(data?.start).startOf('day'), 'days', true);
  const ceiledDuration = Math.ceil(duration);
  if (ceiledDuration < 2) {
    return `${ceiledDuration} day`;
  }

  return `${ceiledDuration} days`;
};

export const getPercentageMarketingCreatorType = (params, currentTab) => {
  if (params?.type === 'percentage' && params?.id === 'undefined') {
    console.log({ currentTab });
    return currentTab;
  }

  console.log({ creator: params?.shopId ? 'admin' : 'shop' });

  return params?.shopId ? 'admin' : 'shop';
};

export const getMarketingDurationData = (mData, creatorType) => {
  const marketingData = mData?.isMarketing ? mData?.data?.marketings : mData?.marketings;

  const existingMarketing = marketingData?.find((mrkting) => mrkting?.creatorType === creatorType);

  let duration = { start: new Date(), end: new Date() };

  if (!existingMarketing && !marketingData?.length) {
    return duration;
  }

  if (!existingMarketing && marketingData?.length) {
    duration = marketingData[0]?.duration;
  }

  if (existingMarketing) duration = existingMarketing?.duration;

  // console.log({ existingMarketing, creatorType });

  return duration;
};
