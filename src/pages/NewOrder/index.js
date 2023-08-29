/* eslint-disable prettier/prettier */
// third party
import { Box, Drawer, Modal, Tab, Tabs } from '@mui/material';

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
import AssignRiderForShop from './AssignRiderForShop';
import OrderRejectForShop from './OrderRejectForShop';
import OrderTable from './OrderTable';
import SearchBar from './Searchbar';
import { getQueryParamsInit } from './helpers';

const orderFilterToTabValueMap = {
  0: 'requested',
  1: 'delivered',
  2: 'cancelled',
  3: 'scheduled',
};

const getTabOptions = () => {
  const tabsOptions = [
    { value: 'requested', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_to_pickup', label: 'Ready' },
    { value: 'order_on_the_way', label: 'On the way' },
  ];

  return tabsOptions;
};

export default function NewOrders({ showFor }) {
  const { currentUser } = useGlobalContext();

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);

  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(showFor, currentUser));
  const [currentTab, setCurrentTab] = useState(0);

  // by defualt we assign ongoing tab as requested where we can only see the requested order here.
  const [tabForOngoing, setTabForOngoing] = useState('requested');

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
    },
  );

  const onAcceptHandler = () => {
    const isSelfShop = currentOrder?.shop?.haveOwnDeliveryBoy;

    if (isSelfShop) {
      setOpenAcceptModal(true);
    }
  };
  const onRejectHandler = () => {
    setOpenCancelModal(true);
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
              setQueryParams((prev) => ({ ...prev, type: value, page: 1 }));
            }}
          />
        </Box>
      )}

      <SearchBar searchPlaceHolder="Search items" queryParams={queryParams} setQueryParams={setQueryParams} />

      <OrderTable
        loading={ordersQuery?.isLoading}
        orders={ordersQuery?.data?.data.orders}
        orderType={orderFilterToTabValueMap[currentTab]}
        updateQueryParams={(type) => {
          if (getTabOptions().findIndex((option) => option?.value === type) > -1) {
            setQueryParams((prev) => ({ ...prev, type }));
            setTabForOngoing(type);
          }
        }}
        onRowClick={({ row }) => {
          setCurrentOrder(row);
          setSidebarOpen(true);
        }}
        adminType={showFor}
      />

      {!ordersQuery?.isLoading && (
        <TablePagination
          currentPage={queryParams?.page}
          lisener={(page) => {
            setQueryParams((prev) => ({ ...prev, page }));
          }}
          totalPage={totalPage}
        />
      )}

      {/* @Order details here */}
      <Drawer open={Boolean(sidebarOpen)} anchor="right">
        <OrderDetail
          showFor="shop"
          onClickAccept={onAcceptHandler}
          onClickReject={onRejectHandler}
          order={currentOrder}
          onClose={() => {
            setSidebarOpen(false);
          }}
        />
      </Drawer>

      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '1250 !important' }}
      >
        <OrderRejectForShop setOpenCancelModal={setOpenCancelModal} currentOrder={currentOrder} />
      </Modal>

      <Modal
        open={openAcceptModal}
        onClose={() => {
          setOpenAcceptModal(!openAcceptModal);
        }}
        sx={{ zIndex: '1250 !important' }}
      >
        <AssignRiderForShop
          onClose={() => {
            setOpenAcceptModal(false);
          }}
          currentOrder={currentOrder}
        />
      </Modal>
    </Box>
  );
}
