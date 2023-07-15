import { Stack } from '@mui/material';
import moment from 'moment';
import { React, useState } from 'react';
import { useQuery } from 'react-query';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import OrderItem from './LastOrderItem';
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
