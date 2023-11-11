/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// third party
import { Box, Drawer, Modal, Stack, Tab, Tabs, Typography } from '@mui/material';

// project import
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import OrderDetail from '../../components/Shared/OrderDetail';
import { getNextStatus } from '../../components/Shared/UpdateOrderStatus/helpers';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

import socketServices from '../../common/socketService';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import useQueryParams from '../../helpers/useQueryParams';
import AcceptRestaurent from './AcceptRestaurent';
import AssignRiderForShop from './AssignRiderForShop';
import AdjustOrderForShop from './MoreOptions/AdjustOrder';
import OrderRejectForShop from './OrderRejectForShop';
import OrderTable from './OrderTable';
import SearchBar from './Searchbar';
import { getQueryParamsInit, validateAndGenerateStatusData } from './helpers';

const orderFilterToTabValueMap = {
  0: 'requested',
  1: 'delivered',
  2: 'cancelled',
  3: 'scheduled',
  all: 0,
  requested: 0,
  delivered: 1,
  cancelled: 2,
  scheduled: 3,
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

  const { socket } = useSelector((state) => state.socketReducer);

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [openAcceptModal, setOpenAcceptModal] = useState(false);

  const [openAcceptRestaurentModal, setOpenAcceptRestaurentModal] = useState(false);

  const [openAdjustmentOrder, setOpenAdjustmentOrder] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [totalPage, setTotalPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const queryClient = useQueryClient();

  const [currentOrder, setCurrentOrder] = useState({});

  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit(showFor, currentUser));

  const [currentTab, setCurrentTab] = useState(orderFilterToTabValueMap[queryParams?.orderType]);

  // By defualt we assign ongoing tab as requested where we can only see the requested order here.
  const [tabForOngoing, setTabForOngoing] = useState('requested');

  // ---------------------- -------------------------------- ---------------------------
  // When order type is ongoing we removed the date filter.
  // When order type is not ongoing we add the date filter with selected current week.
  // ---------------------- -------------------------------- ---------------------------

  useEffect(() => {
    console.log(orderFilterToTabValueMap[currentTab]);
    if (orderFilterToTabValueMap[currentTab] === 'requested') {
      setQueryParams((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
    } else {
      setQueryParams((prev) => ({
        ...prev,
        startDate: getFirstMonday('week').format('YYYY/MM/DD'),
        endDate: moment().format('YYYY/MM/DD'),
      }));
    }
  }, [currentTab]);

  // @when we are getting success to update any order status this method will call.
  const onSuccess = (response, payload) => {
    // notification
    successMsg(response?.message, response?.status ? 'success' : undefined);

    if (response.status) {
      queryClient.invalidateQueries(Api.ORDER_LIST);
      queryClient.invalidateQueries(Api.URGENT_ORDER_COUNT);
      queryClient.invalidateQueries(Api.LATE_ORDER_COUNT);

      // if (onUpdateSuccess) onUpdateSuccess(response);

      setOpenAcceptModal(false);
      setOpenConfirm(false);
      setOpenAcceptRestaurentModal(false);

      const type = response?.data?.order?.orderStatus;

      if (getTabOptions().findIndex((option) => option?.value === type) > -1) {
        setQueryParams((prev) => ({ ...prev, type }));
        setTabForOngoing(type);
      }

      // emit socket

      console.log({ payload });

      if (payload?.data?.orderStatus === 'accepted_delivery_boy') {
        socketServices?.emit('adminAcceptedOrder', { orderId: payload.data?.orderId });
      } else {
        socketServices?.emit('updateOrder', {
          orderId: payload.data?.orderId,
        });
      }

      if (response?.data?.order?.orderStatus === 'delivered') {
        setSidebarOpen(false);
      } else {
        setCurrentOrder(response?.data?.order);
      }
    }
  };

  // @Get all order list from this query
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

  // @update order status from this query
  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess,
      onError: (error) => {
        console.log('api error: ', error);
      },
    },
  );

  const updateStatusHandler = async () => {
    const validated = validateAndGenerateStatusData(currentOrder, '');
    const currentOrderDelivery = currentOrder?.deliveryBoy;
    const haveOwnDeliveryBoy = currentOrder?.shop?.haveOwnDeliveryBoy;

    /*
    @When we choose no-rider that means there are no riders to delivered this order.
    so in that case shop should delivered this order.
    so here we check,
    - next step is ready_to_pickup or not
    - shop have their own delivery boy or not.
    - shop select any rider or not or there are no rider to delivered their order.

    if all the cases comes true then shouldConvertStatusOnTheWay will assigned with true.
    */
    const shouldConvertStatusOnTheWay =
      getNextStatus(currentOrder) === 'ready_to_pickup' && haveOwnDeliveryBoy && !currentOrderDelivery;
    console.log({ validated });
    if (validated?.status === false) return;

    const payload = validated?.data;

    /*
    if shouldConvertStatusOnTheWay true that means there are no rider to delivered this order.
    shop sould delivered it. so here we update one step forward within order status sequences. 
    */

    if (shouldConvertStatusOnTheWay) {
      await updateStatusMutation.mutateAsync({ data: { ...payload, orderStatus: 'ready_to_pickup' } });
      await updateStatusMutation.mutateAsync({ data: { ...payload, orderStatus: 'order_on_the_way' } });
      return;
    }

    updateStatusMutation.mutate({ data: payload });
  };

  const onAcceptHandler = () => {
    const isSelfShop = currentOrder?.orderFor === 'specific';

    const shouldReplacementOrderOntheWay =
      !currentOrder?.isReplacementItemPickFromUser &&
      currentOrder?.replacementOrderDeliveryInfo?.deliveryType === 'shop-customer-shop' &&
      currentOrder?.orderStatus === 'order_on_the_way';

    /* @Here we check whether the next status is preparing or not */
    const shouldOpenAcceptedModal = getNextStatus(currentOrder) === 'preparing';

    /* @ if delivery method is self
    and next status is preparing then it update the openAcceptModal state as true to open the modal
    */
    console.log({ isSelfShop, shouldOpenAcceptedModal, currentOrder });

    if (isSelfShop && shouldOpenAcceptedModal) {
      setOpenAcceptModal(true);
      return;
    }

    if (shouldOpenAcceptedModal) {
      setOpenAcceptRestaurentModal(true);
      return;
    }

    /*
    @when next status is delivered it will execute and open the accept modal. 
    Here we used accept modal for both assigning riders and select currency
    */

    if (
      !shouldReplacementOrderOntheWay &&
      !currentOrder?.isReplacementOrder &&
      getNextStatus(currentOrder) === 'delivered'
    ) {
      setOpenAcceptModal(true);
      return;
    }

    if (getNextStatus(currentOrder) === 'ready_to_pickup' && currentOrder?.deliveryBoy) {
      setOpenConfirm(true);
      return;
    }

    updateStatusHandler();
  };

  /*
  @When we will click on reject button from order details it will triggered
  */
  const onRejectHandler = () => {
    setOpenCancelModal(true);
  };

  // when click on more button

  const onClickAdjustOrder = (data) => {
    setOpenAdjustmentOrder((prev) => !prev);
    setCurrentOrder(data);
  };

  return (
    <Box pb={9}>
      <PageTop title="Orders" />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setQueryParams((prev) => ({ ...prev, type: orderFilterToTabValueMap[newValue], page: 1 }));
          setTabForOngoing(orderFilterToTabValueMap[newValue]);
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

      <SearchBar
        searchPlaceHolder="Search Orders"
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        showFilter={{
          search: true,
          date: orderFilterToTabValueMap[currentTab] !== 'requested',
          sort: true,
        }}
      />

      <OrderTable
        loading={ordersQuery?.isLoading}
        orders={ordersQuery?.data?.data.orders}
        orderType={orderFilterToTabValueMap[currentTab]}
        onRowClick={({ row }) => {
          setCurrentOrder(row);
          setSidebarOpen(true);
        }}
        adminType={showFor}
      />

      {!ordersQuery?.isLoading && (
        <TablePagination
          currentPage={Number(queryParams?.page || 1)}
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
          onClickAdjustOrder={onClickAdjustOrder}
          onLoadingUpdateStatus={updateStatusMutation?.isLoading}
          order={currentOrder}
          onClose={() => {
            setSidebarOpen(false);
          }}
        />
      </Drawer>

      {/* If shop want to reject order before preparing/ if the order is new or requested order
      in that case shop can reject the order 
      otherwise the reject button will not visible 
      and this modal not working */}

      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '1250 !important' }}
      >
        <OrderRejectForShop
          onClose={() => {
            setOpenCancelModal(false);
            setSidebarOpen(false);
          }}
          onSuccess={(data) => {
            // when rejection is successfull it will update the currentOrder state
            setCurrentOrder(data?.data?.order);
          }}
          currentOrder={currentOrder}
        />
      </Modal>

      {/* If delivery method is shop and next step is preparing and 
      next step delivered in that case this modal will visible otherwise not visible 
      in delivered status it will open for choose currency options
      */}

      <Modal
        open={openAcceptRestaurentModal}
        onClose={() => {
          setOpenAcceptRestaurentModal(!openAcceptRestaurentModal);
        }}
        sx={{ zIndex: '1250 !important' }}
      >
        <AcceptRestaurent
          currentOrder={currentOrder}
          updateStatusMutation={updateStatusMutation}
          onClose={() => {
            setOpenAcceptRestaurentModal(!openAcceptRestaurentModal);
          }}
        />
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
            // setSidebarOpen(false);
          }}
          updateStatusMutation={updateStatusMutation}
          currentOrder={currentOrder}
        />
      </Modal>

      <Modal open={openAdjustmentOrder} sx={{ zIndex: '1250 !important' }}>
        <AdjustOrderForShop
          currentOrder={currentOrder}
          onClose={() => {
            setOpenAdjustmentOrder(false);
            setSidebarOpen(false);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={openConfirm}
        loading={updateStatusMutation?.isLoading}
        onConfirm={updateStatusHandler}
        onCancel={() => setOpenConfirm(false)}
        message={
          <Stack gap={4} sx={{ maxWidth: '450px' }}>
            <Typography variant="h4">Notify Rider?</Typography>
            <Typography variant="body2" sx={{ fontSize: '16px', lineHeight: '20px', letterSpacing: '0.2px' }}>
              By clicking "Rider for pickup". you will notify the rider that the order is ready to be picked up. Please
              make sure the order is complete and ready before notifiying the rider
            </Typography>
          </Stack>
        }
      />
    </Box>
  );
}
