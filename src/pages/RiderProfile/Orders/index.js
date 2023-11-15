/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Drawer } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import OrderDetail from '../../../components/Shared/OrderDetail';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from './SearchBar';
// import OrderTable from './Table';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import OrderTable from '../../NewOrder/OrderTable';

export const queryParamsInit = {
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  type: 'all',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
  shop: '',
  orderType: 'all',
};

export default function RiderOrders({ riderId }) {
  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
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
    },
  );

  return (
    <Box>
      <SearchBar searchPlaceHolder="Search Orders" queryParams={queryParams} setQueryParams={setQueryParams} />
      <OrderTable
        loading={ordersQuery?.isLoading}
        orderType="riderProfile"
        orders={ordersQuery?.data?.data?.orders}
        threeDotHandler={() => {}}
        adminType="admin"
        onViewDetail={(order) => {
          setCurrentOrder(order);
          setSidebarOpen(true);
        }}
      />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
      <Drawer open={sidebarOpen} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setCurrentOrder({});
            setSidebarOpen(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
