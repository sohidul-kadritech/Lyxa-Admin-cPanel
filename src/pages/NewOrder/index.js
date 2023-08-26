/* eslint-disable prettier/prettier */
// third party
import { Box, Drawer, Tab, Tabs } from '@mui/material';

// project import
import { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import OrderDetail from '../../components/Shared/OrderDetail';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderTable from './OrderTable';
import SearchBar from './Searchbar';
import { getQueryParamsInit } from './helpers';

const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'cancelled',
  3: 'scheduled',
};

const getTabOptions = () => {
  const tabsOptions = [
    { value: 'new', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'on-the-way', label: 'On the way' },
  ];

  return tabsOptions;
};

export default function NewOrders({ showFor }) {
  const { currentUser } = useGlobalContext();

  console.log('currentUser', currentUser);

  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(showFor, currentUser));
  const [currentTab, setCurrentTab] = useState(0);
  const [tabForOngoing, setTabForOngoing] = useState('new');

  const ordersQuery = useQuery(
    [Api.ORDER_LIST, queryParams],
    () =>
      AXIOS.get(Api.ORDER_LIST, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  const threeDotHandler = (menu) => {
    if (menu === 'flag') {
      console.log('flag 1');
    }

    if (menu === 'cancel_order') {
      console.log('flag 1');
    }

    if (menu === 'track_order') {
      console.log('flag 1');
    }

    if (menu === 'refund_order') {
      console.log('flag 1');
    }

    if (menu === 'update_status') {
      console.log('flag 1');
    }
  };

  return (
    <Box pb={9}>
      <PageTop title="Orders" />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setQueryParams((prev) => ({ ...prev, type: orderFilterToTabValueMap[newValue], page: 1 }));
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
        <Tab label="Scheduled" />
      </Tabs>

      {currentTab === 0 && showFor === 'shop' && (
        <Box pb={7.5}>
          <StyledTabs2
            value={tabForOngoing}
            options={getTabOptions()}
            onChange={(value) => {
              setTabForOngoing(value);
            }}
          />
        </Box>
      )}

      <SearchBar searchPlaceHolder="Search items" queryParams={queryParams} setQueryParams={setQueryParams} />

      <OrderTable
        loading={ordersQuery.isLoading}
        orders={ordersQuery?.data?.data.orders}
        orderType={orderFilterToTabValueMap[currentTab]}
        onRowClick={({ row }) => {
          setCurrentOrder(row);
          setSidebarOpen(true);
        }}
        adminType={showFor}
      />

      {!ordersQuery.isLoading && (
        <TablePagination
          currentPage={queryParams?.page}
          lisener={(page) => {
            setQueryParams((prev) => ({ ...prev, page }));
          }}
          totalPage={totalPage}
        />
      )}

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
