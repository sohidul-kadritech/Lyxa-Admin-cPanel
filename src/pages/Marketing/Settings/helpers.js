/* eslint-disable no-unsafe-optional-chaining */
import { Stack, Typography, styled, useTheme } from '@mui/material';
import moment from 'moment';

export const itemSelectOptions = [
  { label: 'Selected Items', value: 'single' },
  { label: 'Entire Menu', value: 'multiple' },
];

export const durationInit = {
  start: moment().format('YYYY-MM-DD'),
  end: moment().endOf('month').format('YYYY-MM-DD'),
};

export const confirmActionInit = {
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

export const createProductData = (
  products,
  { marketingType, rewardAmount, shopMaxDiscount, adminMaxDiscount, creatorType }
) => {
  let prb = null;
  const maxDiscount = Number(creatorType === 'shop' ? shopMaxDiscount : adminMaxDiscount);

  console.log({ maxDiscount });

  const data = products.map((item) => {
    // reward
    if (!item?._id) {
      prb = 'Please remove empty items from list!';
    }

    if (marketingType === 'reward' && !item?.rewardCategory) {
      prb = 'Please select category for product!';
    }

    if (marketingType === 'reward' && !item?.rewardBundle) {
      prb = 'Please select reward bundle for product!';
    }

    if (marketingType === 'reward') {
      return {
        id: item?._id,
        rewardCategory: item?.rewardCategory,
        rewardBundle: item?.rewardBundle,
        reward: {
          amount: (item.price - (item?.price / 100) * item?.rewardBundle).toFixed(2),
          points: Math.round(((item?.price / 100) * item?.rewardBundle) / rewardAmount),
        },
      };
    }

    // percentage
    if (marketingType === 'percentage' && !item?.discountPercentage) {
      prb = 'Please select percentage bundle for product!';
    }

    if (marketingType === 'percentage') {
      const discountAmount = (item?.price / 100) * item?.discountPercentage;

      return {
        id: item?._id,
        discountPercentage: item?.discountPercentage,
        discountPrice: item?.price - (maxDiscount > 0 ? Math.min(discountAmount, maxDiscount) : discountAmount),
        discount: maxDiscount > 0 ? Math.min(discountAmount, maxDiscount) : discountAmount,
      };
    }

    return {
      id: item?._id,
    };
  });

  if (prb) return prb;

  return data;
};

export const createGroupedList = (products, category) =>
  products.filter((item) => !category || item?.category?.name === category);

export const createGroupedDataRow = (products) => {
  const categoryMap = {};
  const result = [];

  products.forEach((item) => {
    if (categoryMap[item?.category?.name] === undefined) {
      categoryMap[item?.category?.name] = [item];
    } else {
      categoryMap[item?.category?.name].push(item);
    }
  });

  Object.entries(categoryMap).forEach((category, index) => {
    result.push({ _id: `c-${index}`, isCategoryHeader: true, categoryName: category[0] });
    result.push(...category[1]);
  });

  return result;
};

// helper components
export function ItemsTitle() {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={2.5}>
      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        sx={{
          lineHeight: '19px',
          fontWeight: 600,
        }}
      >
        Items
      </Typography>
      <span
        style={{
          fontWeight: '500',
          fontSize: '11px',
          lineHeight: '20px',
          color: theme.palette.primary.main,
        }}
      >
        Required
      </span>
    </Stack>
  );
}

export function CommonTitle({ title, subTitle }) {
  const theme = useTheme();

  return (
    <Stack gap={1.5}>
      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        sx={{
          lineHeight: '19px',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <span
        style={{
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '17px',
          color: '#737373',
        }}
      >
        {subTitle}
      </span>
    </Stack>
  );
}

export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  fontWeight: '600',
  fontSize: '16px',
  lineHeight: '28px',
  color: '#737373',
  fontStyle: 'italic',
  padding: '8px 45px 8px 16px',
  backgroundColor: theme.palette.background.secondary,
}));

export const getCurrentFeaturedWeekOption = (marketingData) => {
  const week = marketingData?.data?.marketing?.featuredWeek || 0;
  const amount = marketingData?.data?.marketing?.featuredAmount || 0;
  return { label: `${week} week`, value: amount };
};

export const getDurationLeft = (date) => {
  const targetDate = moment(date);
  const currentDate = moment();

  if (targetDate.diff(currentDate) <= 0) {
    return null;
  }

  const duration = moment.duration(targetDate.diff(currentDate));
  const weeks = Math.floor(duration.asWeeks()) % 4;
  const days = Math.floor(duration.asDays()) % 7;
  const hours = Math.floor(duration.hours()) % 24;
  const minutes = Math.floor(duration.minutes()) % 60;

  let durationStr = '';

  if (weeks >= 1) {
    durationStr += ` ${weeks} week${weeks === 1 ? '' : 's'}`;
  }

  if (days >= 1) {
    durationStr += ` ${days} day${days === 1 ? '' : 's'}`;
  }

  if (weeks < 1 && hours >= 1) {
    durationStr += ` ${hours} hour${hours === 1 ? '' : 's'}`;
  }

  if (weeks < 1 && days < 1 && hours < 1) {
    durationStr += ` ${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  return durationStr;
};

export const getDateRange = (mData) => {
  if (mData?.status === 'inactive') {
    const d = Math.ceil(
      moment(mData?.duration?.end).endOf('day').diff(moment(mData?.marketingPausedAt).startOf('day'), 'days', true)
    );
    return d < 0 ? 0 : d;
  }

  return Math.ceil(moment(mData?.duration?.end).endOf('day').diff(moment().startOf('day'), 'days', true));
};
