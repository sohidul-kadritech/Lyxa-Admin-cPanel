/* eslint-disable no-unused-vars */
import { Box, Drawer } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import TablePagination from '../../components/Common/TablePagination';
import OrderDetail from '../../components/Shared/OrderDetail';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderTable from '../NewOrder/OrderTable';

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  shop: '',
  orderType: 'all',
};

export default function UserOrders({ userId }) {
  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, user: userId });

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
      <Box pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search Orders"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          hideFilters={{
            button: true,
            status: true,
          }}
        />
      </Box>
      <OrderTable
        adminType="admin"
        onRowClick={(params) => {
          setCurrentOrder(params?.row);
          setSidebarOpen(true);
        }}
        loading={ordersQuery?.isLoading}
        threeDotHandler={() => {}}
        orderType="userProfile"
        orders={ordersQuery?.data?.data?.orders}
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
            setSidebarOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </Box>
  );
}
