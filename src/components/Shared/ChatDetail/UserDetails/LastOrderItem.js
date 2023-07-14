import { Avatar, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { orderStatusMap } from '../../../../pages/NewOrder/helpers';

const orderTime = (order) => {
  if (order?.orderStatus === 'cancelled') return moment(order?.orderCancel?.createdAt).format('ddd DD, MMM, YYYY');
  if (order?.orderStatus === 'delivered') return moment(order?.delivered_time).format('ddd DD, MMM, YYYY');
  return '';
};

const getOrderSearchType = (order) => {
  if (order?.orderStatus === 'cancelled') return 'cancelled';
  if (order?.orderStatus === 'delivered') return 'delivered';
  return 'ongoing';
};

export default function OrderItem({ order }) {
  const time = orderTime(order);
  const history = useHistory();

  return (
    <Stack direction="row" alignItems="center">
      <Avatar alt="shop-image" src={order?.shop?.shopLogo} sx={{ width: 36, height: 36 }}>
        {order?.shop?.shopName?.charAt(0)}
      </Avatar>
      <Typography
        variant="inherit"
        fontSize="13px"
        lineHeight="20px"
        fontWeight={500}
        sx={{ color: 'primary.main', cursor: 'pointer' }}
        pl={5}
        pr={1.5}
        onClick={() => {
          history.push(
            `/orders?type=${getOrderSearchType(order)}&searchKey=${order?.orderId}&startDate=${moment(
              order?.createdAt
            ).format('YYYY-MM-DD')}`
          );
        }}
      >
        {order?.shop?.shopName}
      </Typography>
      <Typography variant="inherit" fontSize="11px" lineHeight="22px" color="text.secondary2">
        {orderStatusMap[order?.orderStatus]} {time ? `: ${time}` : ''}
      </Typography>
    </Stack>
  );
}
