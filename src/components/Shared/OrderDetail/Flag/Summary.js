/* eslint-disable no-unsafe-optional-chaining */
import { Stack } from '@mui/material';
import { StyledListItem } from './ListItem';

export default function FlagSummary({ order }) {
  const orderDetailsList = [
    {
      label: 'Order Type',
      value: order?.isButler ? 'Butler' : order?.shop?.shopType,
      itemSx: {
        '& .value': {
          textTransform: 'capitalize',
        },
      },
    },
    {
      label: 'Order Id',
      value: order?.orderId,
      link: true,
      to: order?.orderId?.isButler
        ? `/orders/details/regular/${order?.orderId?._id}`
        : `/orders/details/butler/${order?.orderId?._id}`,
    },
    {
      label: 'Order Staus',
      value: order?.orderStatus,
      itemSx: {
        '& .value': {
          textTransform: 'capitalize',
        },
      },
    },
    {
      label: 'Rider Id',
      value: order?.orderId?.deliveryBoy?.autoGenId ? order?.orderId?.deliveryBoy?.autoGenId : 'Not Assigned',
      link: !!order?.orderId?.deliveryBoy,
      to: `/deliveryman/details/${order?.orderId?.deliveryBoy}`,
    },
    {
      label: 'Created At',
      value: new Date(order?.orderId?.createdAt).toLocaleString(),
    },
    {
      label: 'Payment Type',
      value: order?.paymentMethod,
    },
    {
      label: 'Product Amount',
      value: order?.summary?.productAmount,
      hide: order?.orderType === 'butler',
    },
    {
      label: 'Product Delivery Fee',
      value: order?.summary?.deliveryFee,
    },
    {
      label: 'Vat',
      value: order?.summary?.vat,
    },
    {
      label: 'Total Amount',
      value: (order?.summary?.totalAmount + order?.summary?.vat || 0).toFixed(),
    },
  ];

  return (
    <Stack gap={4} pt={3}>
      {orderDetailsList?.map((item, index) => (
        <StyledListItem key={index} {...item} />
      ))}
    </Stack>
  );
}
