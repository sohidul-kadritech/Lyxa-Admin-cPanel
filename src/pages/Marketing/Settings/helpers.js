import { Stack, Typography, styled, useTheme } from '@mui/material';
import _ from 'lodash';
import moment from 'moment';

// constants

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

// helper functions
export const createGroupedList = (products, category) => {
  const productsList = Object.values(_.groupBy(products || [], (product) => product?.category?.name)).flat();
  return productsList.filter((item) => !item?.marketing && (!category || item?.category?.name === category));
};

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
