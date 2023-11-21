/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Stack, Typography, styled, useTheme } from '@mui/material';
import moment from 'moment';
import FormateBaseCurrency from '../../../components/Common/FormateBaseCurrency';

export const itemSelectOptions = [
  { label: 'Selected Items', value: 'single' },
  { label: 'Entire Menu', value: 'multiple' },
];

export const confirmActionInit = {
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

export const createProductData = (
  products,
  { marketingType, rewardAmount, shopMaxDiscount, adminMaxDiscount, creatorType },
) => {
  let prb = null;
  const maxDiscount = Number(creatorType === 'shop' ? shopMaxDiscount : adminMaxDiscount);

  console.log({ maxDiscount });

  const data = products.map((item) => {
    const findMarketing = item?.marketing?.find((item) => item?.creatorType === creatorType);

    const findProduct = findMarketing?.products?.find((prdct) => prdct?.product === item?._id);

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
    if (marketingType === 'percentage' && !findProduct?.discountPercentage) {
      prb = 'Please select percentage bundle for product!';
    }

    if (marketingType === 'percentage') {
      const discountAmount = (item?.price / 100) * findProduct?.discountPercentage;

      return {
        id: item?._id,
        discountPercentage: findProduct?.discountPercentage,
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
      moment(mData?.duration?.end).endOf('day').diff(moment(mData?.marketingPausedAt).startOf('day'), 'days', true),
    );
    return d < 0 ? 0 : d;
  }

  return Math.ceil(moment(mData?.duration?.end).endOf('day').diff(moment().startOf('day'), 'days', true));
};

export const getRemainingSpendingLimit = (spendLimit, amountSpent) => {
  const remainingSpentLimit = spendLimit - amountSpent;

  /*
  @For example we have no spending limit
  spending limit: 0,
  amount spending: 1800,
  Now remaining spentLimit will be -1800, that means it exceed its limit or there are no spending limits 
  (In our case spending limit is 0 that means there are no spending limit).
  here we check if our remaining spend limit is negative or zero it returns zero otherwise it returns actual one.
  in this example it return 0


  For example we have some spending limit
  spending limit: 200,
  amount spending: 120,
  Now remaining spentLimit will be 80
  in this example it return 80 not zero. because it greater than 0.
  */

  if (remainingSpentLimit > 0) {
    return remainingSpentLimit;
  }

  return 0;
};

export const getDualMarketingPrice = (productForAdmin, productForShop, price, discountAmount, creatorType) => {
  if (productForAdmin && productForShop) {
    const output = {
      admin: price - discountAmount - productForShop?.discount || 0,
      shop: price - discountAmount - productForAdmin?.discount || 0,
    };

    return output[creatorType];
  }

  return false;
};

export const toolTipTextForDualMarketing = (productForAdmin, productForShop, currentData, creatorType) => {
  // console.log({ productForAdmin, productForShop, currentData });

  if (!productForAdmin || !productForShop) {
    return '';
  }
  const component = (
    <div>
      <p
        style={{
          padding: '4px 16px',
          marginBottom: '0',
          minWidth: '180px',
        }}
      >
        {productForAdmin && productForShop
          ? 'Dual Marketing'
          : `${creatorType.charAt(0).toUpperCase() + creatorType.slice(1)} Final Discount Price`}
      </p>

      {productForAdmin && productForShop && (
        <ul
          style={{
            padding: '4px 16px',
            marginBottom: '0',
            minWidth: '180px',
          }}
        >
          <>
            <li>
              Admin:{' '}
              {FormateBaseCurrency.get(
                creatorType === 'admin' ? currentData?.finalDiscountAmount : productForAdmin?.discount,
              )}
            </li>
            <li>
              Shop:{' '}
              {FormateBaseCurrency.get(
                creatorType === 'shop' ? currentData?.finalDiscountAmount : productForShop?.discount,
              )}
            </li>
          </>
        </ul>
      )}
    </div>
  );

  // const output = {
  //   admin: <span></span>
  // }

  return component;
};
