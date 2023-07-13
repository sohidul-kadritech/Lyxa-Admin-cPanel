import { Avatar, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { React, useState } from 'react';
import { useQuery } from 'react-query';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import { orderStatusMap } from '../../../../pages/NewOrder/helpers';
import { LastOrdersSkeleton, StyledProfileBox } from './helpers';

const queryParamsInit = (userId) => ({
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  orderType: 'all',
  model: '',
  user: userId,
});

const orderTime = (order) => {
  if (order?.orderStatus === 'cancelled') return moment(order?.orderCancel?.createdAt).format('ddd DD, MMM, YYYY');
  if (order?.orderStatus === 'delivered') return moment(order?.delivered_time).format('ddd DD, MMM, YYYY');
  return '';
};

function OrderItem({ order }) {
  return (
    <Stack direction="row" alignItems="center">
      <Avatar alt="shop-image" src={order?.shop?.shopLogo} sx={{ width: 36, height: 36 }}>
        {order?.shop?.shopName?.charAt(0)}
      </Avatar>
      <Typography variant="inherit" fontSize="13px" lineHeight="20px" fontWeight={500} pl={5} pr={1.5}>
        {order?.shop?.shopName}
      </Typography>
      <Typography variant="inherit" fontSize="11px" lineHeight="22px" color="text.secondary2">
        {orderStatusMap[order?.orderStatus]} : {orderTime(order)}
      </Typography>
    </Stack>
  );
}

export default function LastOrder({ userId }) {
  const [queryParams] = useState(queryParamsInit(userId));

  const query = useQuery([Api.ORDER_LIST, queryParams], () =>
    AXIOS.get(Api.ORDER_LIST, {
      params: queryParams,
    })
  );

  return (
    <StyledProfileBox title="Last 5 Orders">
      {query.isLoading && <LastOrdersSkeleton />}
      {!query?.isLoading && (
        <Stack gap={2} pt={3.5}>
          {query?.data?.data?.orders?.map((order) => (
            <OrderItem order={order} key={order?._id} />
          ))}
        </Stack>
      )}
    </StyledProfileBox>
  );
}
