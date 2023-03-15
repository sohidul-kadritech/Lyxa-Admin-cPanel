/* eslint-disable no-unsafe-optional-chaining */
// mui
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../helpers/successMsg';
import * as Api from '../network/Api';
import Axios from '../network/axios';
import DetailList from './DetailList';

const flagTypeMap = {
  user: 'User',
  delivery: 'Rider',
  shop: 'Shop',
  refused: 'Refused',
  auto: 'Auto Cancel',
  delay: 'Delay',
};

export default function FlagDetails({ flag, closeSideBar }) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const orderDetailsList = [
    {
      label: 'Order Type',
      value: flag?.orderId?.isButler ? 'Butler' : flag?.orderId?.shop?.shopType,
      itemSx: {
        '& .value': {
          textTransform: 'capitalize',
        },
      },
    },
    {
      label: 'Order Id',
      value: flag?.orderId.orderId,
      link: true,
      to: flag?.orderId?.isButler
        ? `/orders/details/regular/${flag?.orderId?._id}`
        : `/orders/details/butler/${flag?.orderId?._id}`,
    },
    {
      label: 'Order Staus',
      value: flag?.orderId?.orderStatus,
      itemSx: {
        '& .value': {
          textTransform: 'capitalize',
        },
      },
    },
    {
      label: 'Rider Id',
      value: flag?.orderId?.deliveryBoy?.autoGenId ? flag?.orderId?.deliveryBoy?.autoGenId : 'Not Assigned',
      link: !!flag?.orderId?.deliveryBoy,
      to: `/deliveryman/details/${flag?.orderId?.deliveryBoy}`,
    },
    {
      label: 'Created At',
      value: new Date(flag?.orderId?.createdAt).toLocaleString(),
    },
    {
      label: 'Payment Type',
      value: flag?.orderId?.paymentMethod === 'cash' ? 'Cash' : 'Wallet',
    },
    {
      label: 'Product Amount',
      value: flag?.orderId?.summary?.productAmount,
      hide: flag?.orderType === 'butler',
    },
    {
      label: 'Product Delivery Fee',
      value: flag?.orderId?.summary?.deliveryFee,
    },
    {
      label: 'Vat',
      value: flag?.orderId?.summary?.vat,
    },
    {
      label: 'Total Amount',
      value: flag?.orderId?.summary?.totalAmount + flag?.orderId?.summary?.vat,
    },
  ];

  const flagDetailOptions = [
    {
      label: 'Flag Type',
      value: flagTypeMap[flag?.type],
      itemSx: {
        '& .value': {
          textTransform: 'capitalize',
        },
      },
    },
    {
      label: 'Flag Comment',
      value: flag?.comment,
    },
  ];

  const flagResolve = useMutation(
    () =>
      Axios.post(Api.RESOLVE_FLAG, {
        id: flag?._id,
        resolved: true,
      }),
    {
      onError: (error) => {
        console.log(error);
        successMsg(error, 'error');
      },

      onSuccess: (data) => {
        if (data?.status) {
          successMsg(data?.message, 'success');
          closeSideBar();
          queryClient.invalidateQueries({ queryKey: ['flagged_orders'] });
        } else {
          successMsg(data?.message, 'warn');
        }
      },
    }
  );

  return (
    <Box mt={10}>
      {/* Order Details */}
      <Stack gap={6} mb={10}>
        <Typography variant="h3">Flag Details</Typography>
        <Box
          padding={2}
          bgcolor={theme.palette.grey[100]}
          sx={{
            borderRadius: '6px',
            border: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <DetailList list={flagDetailOptions} />
        </Box>
      </Stack>
      <Stack gap={6}>
        <Typography variant="h3">Order Details</Typography>
        <Box
          padding={2}
          bgcolor={theme.palette.grey[100]}
          sx={{
            borderRadius: '6px',
            border: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <DetailList list={orderDetailsList} />
        </Box>
      </Stack>
      {!flag?.isResolved && (
        <Box pt={7}>
          <Button
            fullWidth
            variant="contained"
            disabled={flagResolve.isLoading}
            onClick={() => {
              flagResolve.mutate();
            }}
          >
            Resolve
          </Button>
        </Box>
      )}
    </Box>
  );
}
