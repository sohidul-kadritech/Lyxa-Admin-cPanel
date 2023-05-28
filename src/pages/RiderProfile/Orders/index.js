/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from './SearchBar';
import OrderTable from './Table';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export default function RiderOrders({ riderId }) {
  console.log({ riderId });
  const [totalPage, setTotalPage] = useState(1);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, deliveryBoy: riderId });

  const ordersQuery = useQuery(
    [Api.ORDER_LIST, { ...queryParams }],
    () =>
      AXIOS.get(Api.ORDER_LIST, {
        params: { ...queryParams },
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box>
      <SearchBar searchPlaceHolder="Search Orders" queryParams={queryParams} setQueryParams={setQueryParams} />
      <OrderTable orders={ordersQuery?.data?.data?.orders} />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </Box>
  );
}
