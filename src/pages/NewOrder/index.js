// third party
import { Box, Drawer, Tab, Tabs } from '@mui/material';

// project import
import { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import OrderDetail from '../../components/Shared/OrderDetail';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderTable from './OrderTable';
import SearchBar from './Searchbar';
import { fiterOrders, queryParamsInit } from './helpers';

const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'incomplete',
};

export default function NewOrders() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, shop: shop?._id });
  const [currentTab, setCurrentTab] = useState(0);

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
    <Box pb={9}>
      <PageTop title="Orders" />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          paddingBottom: '30px',

          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Ongoing" />
        <Tab label="Delivered" />
        <Tab label="Incomplete" />
      </Tabs>
      <SearchBar searchPlaceHolder="Search items" queryParams={queryParams} setQueryParams={setQueryParams} />
      <OrderTable
        orders={fiterOrders(ordersQuery?.data?.data.orders, orderFilterToTabValueMap[currentTab])}
        orderFilter={orderFilterToTabValueMap[currentTab]}
        onRowClick={({ row }) => {
          setCurrentOrder(row);
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
