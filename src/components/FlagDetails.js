/* eslint-disable no-unsafe-optional-chaining */
// mui
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useMutation } from 'react-query';
import { successMsg } from '../helpers/successMsg';
import * as Api from '../network/Api';
import Axios from '../network/axios';
import DetailList from './DetailList';

// get flag types
const getFlagTypes = (flag) => {
  if (flag?.isAutomatic) {
    return 'Auto';
  }

  if (flag?.isRefused) {
    return 'Refused';
  }

  if (flag?.user) {
    return 'User';
  }

  if (flag?.delivery) {
    return 'Rider';
  }

  if (flag?.shop) {
    return 'Shop';
  }

  return '';
};
export default function FlagDetails({ flag, closeSideBar, refetchFlags }) {
  const theme = useTheme();
  const orderDetailsList = [
    {
      label: 'Order Type',
      value: flag?.orderType,
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
      to: `/orders/details/${flag?.orderId?._id}`,
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
      value: getFlagTypes(flag),
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
          refetchFlags();
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
