/* eslint-disable no-unsafe-optional-chaining */
import { Stack } from '@mui/material';
import moment from 'moment';
import { StyledListItem } from './ListItem';

export default function FlagSummary({ order }) {
  console.log(order);

  const orderDetailsList = [
    {
      label: 'Order Type',
      value: order?.isButler ? 'Butler' : order?.shop?.shopType,
    },
    {
      label: 'Order Id',
      value: order?.orderId,
    },
    {
      label: 'Order Staus',
      value: order?.orderStatus,
    },
    {
      label: 'Rider Id',
      value: order?.deliveryBoy?.autoGenId || 'Not Assigned',
    },
    {
      label: 'Created At',
      value: moment(order?.createdAt)?.format('MMM DD, YYYY'),
    },
    {
      label: 'Payment Type',
      value: order?.paymentMethod,
    },
    {
      label: 'Product Amount',
      value: (order?.summary?.productAmount || 0).toFixed(2),
      hide: order?.orderType === 'butler',
    },
    {
      label: 'Product Delivery Fee',
      value: (order?.summary?.deliveryFee || 0).toFixed(2),
    },
    {
      label: 'Vat',
      value: (order?.summary?.vat || 0).toFixed(2),
    },
    {
      label: 'Total Amount',
      value: (order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0).toFixed(2),
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
