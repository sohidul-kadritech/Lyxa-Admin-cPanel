/* eslint-disable no-unused-vars */
// mui
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { successMsg } from '../helpers/successMsg';
import * as Api from '../network/Api';
import Axios from '../network/axios';
import DetailList from './DetailList';

// get flag types
const getFlagTypes = (flag, model) => {
  const types = [];

  if (flag?.isAutomatic) {
    types.push('Auto');
    return types;
  }

  if (flag?.isRefused) {
    types.push('Refused');
    return types;
  }

  if (flag?.user) {
    types.push('User');
  }

  if (model === 'butler' && flag?.butlerId) {
    types.push('Butler');
  }

  if (model === 'order' && flag?.deliveryId) {
    types.push('Rider');
  }

  return types;
};

export default function FlagDetails({ flag, closeSideBar }) {
  const theme = useTheme();
  const history = useHistory();

  const orderDetailsList = [
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
      value: flag?.orderId?.deliveryBoy ? flag?.orderId?.deliveryBoy : 'Not Assigned',
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
      value: flag?.orderId?.summary?.totalAmount,
    },
  ];

  const flagDetailOptions = [
    {
      label: 'Flag Type',
      value: getFlagTypes(flag).join(','),
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
