/* eslint-disable no-unused-vars */
// third party
import { Box, Drawer } from '@mui/material';

// project import
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderDetail from './OrderDetail';
import OrderTable from './OrderTable';
import SearchBar from './Searchbar';
import { getQueryParamsInit } from './helpers';

export default function NewOrders() {
  const shop = useSelector((store) => store.Login.admin);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(shop?._id));

  const ordersQuery = useQuery(
    ['single-shop-orders', { ...queryParams }],
    () =>
      AXIOS.get(Api.ORDER_LIST, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <Box>
      <PageTop title="Orders" />
      <SearchBar searchPlaceHolder="Search 24 items" queryParams={queryParams} setQueryParams={setQueryParams} />
      <OrderTable
        orders={ordersQuery?.data?.data.orders}
        onRowClick={({ row }) => {
          setCurrentOrder(row);
          setSidebarOpen(true);
        }}
      />
      <Drawer open={Boolean(sidebarOpen)} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setSidebarOpen(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
