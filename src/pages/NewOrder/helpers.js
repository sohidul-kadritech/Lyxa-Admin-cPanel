/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable default-param-last */
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';

export const orderStatusMap = {
  placed: 'Pending',
  accepted_delivery_boy: 'Rider Accepted',
  preparing: 'Restaurant Accepted',
  ready_to_pickup: 'Ready to pickup',
  order_on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refused: 'Rejected',
};

export const statusColorVariants = {
  placed: {
    color: '#FFB017',
    background: 'rgba(255, 176, 23, 0.15)',
  },

  accepted_delivery_boy: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  preparing: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  ready_to_pickup: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  order_on_the_way: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  delivered: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  cancelled: {
    color: '#DD5B63',
    background: '#FEE2E2',
  },

  refused: {
    color: '#454545',
    background: '#F0F0F0',
  },
};

export const sortOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

export const queryParamsInit = {
  page: 1,
  pageSize: 25,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export const fiterOrders = (orders = [], filter) => {
  const filters = {
    ongoing: {
      placed: true,
      accepted_delivery_boy: true,
      preparing: true,
      ready_to_pickup: true,
      order_on_the_way: true,
    },

    delivered: {
      delivered: true,
    },

    incomplete: {
      cancelled: true,
      refused: true,
    },
  };

  const cFilter = filters[filter];

  return orders.filter((order) => cFilter && cFilter[order?.orderStatus]);
};

export const getOrderProfit = (order) => {
  const totalAmount = order?.summary?.productAmount + (order?.orderFor !== 'global' ? order?.summary?.deliveryFee : 0);
  return totalAmount - order?.dropCharge?.dropChargeFromOrder;
};

export function StyledOrderDetailBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export function UserAvatar({ imgUrl, imgAlt, imgFallbackCharacter, name, subTitle }) {
  return (
    <Stack direction="row" alignItems="center" gap={5}>
      <Avatar alt={imgAlt} src={imgUrl} sx={{ width: 36, height: 36 }}>
        {imgFallbackCharacter}
      </Avatar>
      <Stack gap={1.5}>
        <Typography variant="body4">{name}</Typography>
        {subTitle && (
          <Typography
            variant="body4"
            sx={{
              fontSize: '13px',
              lineHeight: '15px',
              color: '#737373',
            }}
          >
            {subTitle}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
