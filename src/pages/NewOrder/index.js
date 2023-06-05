// third party
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

// project import
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'reactstrap';
import CloseButton from '../../components/Common/CloseButton';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import OrderDetail from '../../components/Shared/OrderDetail';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderTable from './OrderTable';
import PageSkeleton from './PageSkeleton';
import SearchBar from './Searchbar';
import { getQueryParamsInit } from './helpers';
// eslint-disable-next-line no-unused-vars
import { cancelButlerOrderByAdmin } from '../../store/Butler/butlerActions';
// eslint-disable-next-line no-unused-vars
import { cancelOrderByAdmin } from '../../store/order/orderAction';
import RefundOrder from './RefundOrder';

const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'cancelled',
};
const cancelOrderInit = {
  cancelReasonId: '',
  orderId: null,
  otherReason: '',
  refundType: 'none',
  deliveryBoy: {},
  partialPayment: {
    deliveryBoy: '',
    admin: '',
  },
};

// flag type options
const butlerFlagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Butler', value: 'delivery' },
];

const orderFlagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Rider', value: 'delivery' },
  { label: 'Shop', value: 'shop' },
];

export default function NewOrders({ showFor }) {
  const { socket } = useSelector((state) => state.socketReducer);
  const { currentUser } = useGlobalContext();
  const [totalPage, setTotalPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({});
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(showFor, currentUser));
  const [currentTab, setCurrentTab] = useState(0);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [flagModal, setFlagModal] = useState(false);
  const [flagType, setFlagType] = useState([]);
  const [flagComment, setFlagComment] = useState('');
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [orderCancel, setOrderCancel] = useState(cancelOrderInit);
  // eslint-disable-next-line no-unused-vars
  const [orderPayment, setOrderPayment] = useState({
    deliveryBoy: 0,
    admin: 0,
  });
  // const { cancelReasons } = useSelector((state) => state.settingsReducer);
  // console.log('cancel reason: ', cancelReasons);
  // eslint-disable-next-line no-unused-vars
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentOrderShop, setCurrentOrderShop] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState({});
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getCancelReasonsQuery = useQuery([Api.ALL_ORDER_CANCEL_REASON], () => AXIOS.get(Api.ALL_ORDER_CANCEL_REASON));
  console.log('getCancelReasonsQuery', getCancelReasonsQuery?.data?.data?.cancelReason);
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
      // eslint-disable-next-line prettier/prettier
    },
  );

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'cancel_order') {
      setCurrentOrder(order);
      setOpenCancelModal(!openCancelModal);

      if (order?.isButler) {
        setOrderPayment({
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge,
        });
        console.log('order', order);
        setOrderCancel({
          ...orderCancel,
          cancelReasonId: '',
          otherReason: '',
          deliveryBoy: order?.deliveryBoy,
          paymentMethod: order?.paymentMethod,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          summary: order?.summary,
        });
      } else {
        setOrderPayment({
          shop: order?.sellerEarnings,
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge?.totalDropAmount,
        });
        setOrderCancel({
          ...orderCancel,
          cancelReasonId: '',
          otherReason: '',
          deliveryBoy: order?.deliveryBoy,
          paymentMethod: order?.paymentMethod,
          shop: order?.shop,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          summary: order?.summary,
        });
      }
    }
    if (menu === 'refund_order') {
      setCurrentOrder(order);
      setOpenRefundModal(!openRefundModal);

      if (order?.isButler) {
        setOrderPayment({
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge,
        });
        setOrderCancel({
          ...orderCancel,
          cancelReasonId: '',
          otherReason: '',
          deliveryBoy: order?.deliveryBoy,
          paymentMethod: order?.paymentMethod,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          summary: order?.summary,
        });
      } else {
        setOrderPayment({
          shop: order?.sellerEarnings,
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge?.totalDropAmount,
        });
        setOrderCancel({
          ...orderCancel,
          cancelReasonId: '',
          otherReason: '',
          deliveryBoy: order?.deliveryBoy,
          paymentMethod: order?.paymentMethod,
          shop: order?.shop,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          summary: order?.summary,
        });
      }
    }
    if (menu === 'update_status') {
      setUpdateStatusModal(true);
      setCurrentOrder(order);
      setCurrentOrderShop(order?.shop);
      setCurrentOrderDelivery(order?.deliveryBoy || {});
    }
  };

  const resetUpdateStatusModal = () => {
    setUpdateStatusModal(false);
    setNewOrderStatus('');
    setCurrentButlerSearchKey('');
    setCurrentOrderDelivery({});
    setCurrentOrder({});
    setCurrentOrderShop({});
  };
  const resetFlagModal = () => {
    setFlagModal(false);
    setFlagType([]);
    setFlagComment('');
  };
  // get order update status options
  const updateOrderStatusOptions = (currentOrder) => {
    const list = [];

    currentOrder?.timeline?.forEach((item) => {
      if (item.status === 'placed') return;
      if (item.status === 'accepted_delivery_boy' ? false : currentOrder?.orderStatus === item?.status) return;

      list.push({
        value: item?.status,
        label: item?.title,
      });
    });

    return list;
  };

  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

  // eslint-disable-next-line prettier/prettier, no-unused-vars
  const refundOrderMutation = useMutation((data) => AXIOS.post(Api.REFUND_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'succes');
        setOpenRefundModal(false);
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data, config) => {
        console.log(data, config);
        if (data.status) {
          successMsg(data?.message, 'success');
          queryClient.invalidateQueries(['all-orders']);
          resetUpdateStatusModal();
          // emit socket
          if (config.service === 'regular') {
            if (config?.data?.orderStatus === 'accepted_delivery_boy')
              socket.emit('adminAcceptedOrder', { orderId: config.data?.orderId });
            else
              socket.emit('updateOrder', {
                orderId: config.data?.orderId,
              });
          }
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // const CancelOrderRefunds = styled.div`
  //   padding-bottom: 10px;
  //   .refund_item_wrapper {
  //     margin-bottom: 5px;
  //     display: flex;
  //     align-items: center;

  //     .refund_input {
  //       width: 180px;
  //       margin-right: 20px;
  //     }
  //   }
  // `;

  const getFlagOptions = (currentOrder) => {
    const options = currentOrder?.isButler ? butlerFlagTypeOptions : orderFlagTypeOptions;
    const newOptions = [];
    let isAllFlagged = true;

    options.forEach((item) => {
      if (!currentOrder?.deliveryBoy?._id && item.value === 'delivery') {
        return;
      }
      if (currentOrder?.flag?.find((flagItem) => flagItem[item.value])) {
        newOptions.push({
          ...item,
          isDisabled: true,
        });
      } else {
        isAllFlagged = false;
        newOptions.push({
          ...item,
        });
      }
    });

    return {
      options: newOptions,
      isAllFlagged,
    };
  };

  const flagOptions = useMemo(() => getFlagOptions(currentOrder), [currentOrder]);

  const nearByDeliveryBoysQuery = useQuery(
    ['single-order-nearby-delivery-boys', { orderId: currentOrder?._id || '' }],
    getNearByDeliveryBoys,
    {
      enabled: newOrderStatus === 'accepted_delivery_boy',
      cacheTime: 0,
      staleTime: 0,
      onSuccess: (data) => {
        if (!data?.status) {
          successMsg(data?.message || 'Could not get delivery boys');
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
        successMsg(error?.message || 'Could not get delivery boys', 'error');
      },
      // eslint-disable-next-line prettier/prettier
    },
  );
  const updateOrderStatus = () => {
    if (newOrderStatus === '') {
      successMsg('Please select status');
      return;
    }

    if (newOrderStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
      successMsg('Please select butler');
      return;
    }

    if (
      (newOrderStatus === 'delivered' || newOrderStatus === 'preparing') &&
      !currentOrderDelivery?._id &&
      !currentOrder?.shop?.haveOwnDeliveryBoy
    ) {
      successMsg(`Assign delivery boy first`);
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = newOrderStatus;
    data.deliveryBoy = currentOrderDelivery?._id || '';
    data.shop = currentOrderShop?._id || undefined;

    updateStatusMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };
  const handleFlagTypeChange = (value) => {
    if (flagType.includes(value)) {
      setFlagType((prev) => prev.filter((val) => val !== value));
    } else {
      setFlagType((prev) => [...prev, value]);
    }
  };

  const addFlagMutation = useMutation(
    (payload) => {
      console.log('payload data', payload.data);
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_ADD_FLAG : Api.SEND_ORDER_FLAG;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          queryClient.invalidateQueries(['all-orders']);
          successMsg(data?.message, 'success');
          resetFlagModal();
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        successMsg(error?.message);
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const addOrderFlag = () => {
    console.log('triggerring order flaggin');
    if (flagComment.trim() === '') {
      successMsg('Comment cannot be empty');
      return;
    }

    if (flagType.length === 0) {
      successMsg('Please select someone to flag');
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.comment = flagComment.trim();

    flagType.forEach((item) => {
      if (item === 'user') {
        data.user = currentOrder?.user?._id;
      }
      if (item === 'delivery') {
        data.delivery = currentOrder?.deliveryBoy?._id;
      }
      if (item === 'shop') {
        data.shop = currentOrder?.shop?._id;
      }
    });

    console.log('add flag: ', { service: currentOrder?.isButler ? 'butler' : 'regular', data });

    addFlagMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  // CANCEL ORDER
  const submitOrderCancel = (e) => {
    e.preventDefault();

    const {
      partialPayment: { deliveryBoy, admin, shop },
    } = orderCancel;

    if (currentOrder?.isButler) {
      if (orderCancel.refundType === 'partial' && !deliveryBoy && !admin) {
        successMsg('Enter Minimum One Partial Amount');
        return;
      }
      const data = {
        ...orderCancel,
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      dispatch(cancelButlerOrderByAdmin(data));
    } else {
      if (orderCancel.refundType === 'partial' && !shop && !deliveryBoy && !admin) {
        successMsg('Enter Minimum One Partial Amount');
        return;
      }

      const data = {
        ...orderCancel,
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      dispatch(cancelOrderByAdmin(data));
    }
  };

  const submitOrderRefund = (e) => {
    e.preventDefault();

    const {
      partialPayment: { admin, shop },
    } = orderCancel;

    if (orderCancel.refundType === 'partial' && !shop && !admin) {
      successMsg('Enter Minimum One Partial Amount');
      return;
    }

    const data = {
      ...orderCancel,
      cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
    };
    const generatedData = {
      orderId: orderCancel?.orderId,
      refundType: orderCancel?.refundType,
      partialPayment: {
        shop: orderCancel?.partialPayment?.shop,
        admin: orderCancel?.partialPayment?.admin,
      },
    };

    delete data.deliveryBoy;

    console.log('refund data: ', generatedData);

    refundOrderMutation.mutate(generatedData);
    // dispatch(cancelOrderByAdmin(data));
  };

  const updateRefundType = (type) => {
    setOrderCancel({
      ...orderCancel,
      refundType: type,
      partialPayment:
        type === 'full'
          ? orderPayment
          : {
              shop: '',
              deliveryBoy: '',
              admin: '',
            },
    });
  };

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;
    const { admin, deliveryBoy, shop } = orderPayment;

    if (name === 'admin' && Number(value) > admin) {
      successMsg('Invalid Lyxa Amount');
      return;
    }
    if (name === 'deliveryBoy' && Number(value) > deliveryBoy) {
      successMsg('Invalid Delivery Boy Amount');
      return;
    }

    if (shop && name === 'shop' && Number(value) > shop) {
      successMsg('Invalid Shop Amount');
      return;
    }

    setOrderCancel({
      ...orderCancel,
      partialPayment: {
        ...orderCancel?.partialPayment,
        [name]: Number(value),
      },
    });
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
      </Tabs>
      <SearchBar searchPlaceHolder="Search items" queryParams={queryParams} setQueryParams={setQueryParams} />
      {ordersQuery.isLoading && <PageSkeleton />}
      {!ordersQuery.isLoading && (
        <OrderTable
          orders={ordersQuery?.data?.data.orders}
          orderFilter={orderFilterToTabValueMap[currentTab]}
          onRowClick={({ row }) => {
            setCurrentOrder(row);
            setSidebarOpen(true);
          }}
          adminType={showFor}
          threeDotHandler={threeDotHandler}
        />
      )}
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

      <Modal
        open={updateStatusModal}
        onClose={() => {
          resetUpdateStatusModal();
        }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
          }}
        >
          <Box padding={5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
              <Typography variant="h3">Update Order Status</Typography>
              <CloseButton
                onClick={() => {
                  resetUpdateStatusModal();
                }}
              />
            </Stack>
            <Stack spacing={6}>
              <FormControl>
                <InputLabel>Select Status</InputLabel>
                <Select
                  value={newOrderStatus}
                  label="Select Status"
                  onChange={(e) => {
                    setNewOrderStatus(e.target.value);
                  }}
                >
                  {updateOrderStatusOptions(currentOrder).map((item) => (
                    <MenuItem key={item.value} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* near by delivery boys */}
              {newOrderStatus === 'accepted_delivery_boy' && (
                <Autocomplete
                  value={currentOrderDelivery}
                  disabled={nearByDeliveryBoysQuery.isLoading || nearByDeliveryBoysQuery.isFetching}
                  onChange={(event, newValue) => {
                    setCurrentOrderDelivery(newValue);
                  }}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  inputValue={currentButlerSearchKey}
                  onInputChange={(event, newInputValue) => {
                    setCurrentButlerSearchKey(newInputValue);
                  }}
                  options={nearByDeliveryBoysQuery.data?.data?.nearByDeliveryBoys || []}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="Select " />}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option._id}>
                      {option.name}
                    </Box>
                  )}
                />
              )}
              <Button
                variant="contained"
                color="primary"
                disabled={updateStatusMutation.isLoading}
                onClick={() => {
                  updateOrderStatus();
                }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Modal>
      {/* flag order modal */}
      <Modal
        open={flagModal}
        onClose={() => {
          resetFlagModal();
        }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
          }}
        >
          <Box padding={5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6}>
              <Typography variant="h3">Add Flag</Typography>
              <CloseButton
                onClick={() => {
                  resetFlagModal();
                }}
              />
            </Stack>
            {flagOptions.isAllFlagged ? (
              <Stack spacing={3} mb={4}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Everyone is already flagged!
                </Typography>
                <Typography variant="body2">Please check order details</Typography>
              </Stack>
            ) : (
              <Stack spacing={6}>
                <Stack direction="row" spacing={5} alignItems="center">
                  <Typography variant="h5">Choose Type</Typography>
                  <OptionsSelect
                    value={flagType}
                    items={flagOptions.options}
                    onChange={handleFlagTypeChange}
                    multiple
                  />
                </Stack>
                <TextField
                  label="Comment"
                  variant="outlined"
                  fullWidth
                  value={flagComment}
                  onChange={(e) => {
                    setFlagComment(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={addFlagMutation.isLoading}
                  fullWidth
                  onClick={() => {
                    addOrderFlag();
                  }}
                >
                  Update
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Modal>
      {/* cancel order modal */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
          }}
        >
          <Box padding={5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
              <Typography variant="h3">Cancel Order</Typography>
              <CloseButton
                onClick={() => {
                  setOpenCancelModal(false);
                }}
              />
            </Stack>
            <Form onSubmit={submitOrderCancel}>
              <Autocomplete
                className="cursor-pointer mt-3"
                disabled={isOtherReason}
                value={orderCancel.cancelReasonId}
                onChange={(event, newValue) => {
                  setOrderCancel({
                    ...orderCancel,
                    cancelReasonId: newValue,
                    otherReason: '',
                  });
                }}
                getOptionLabel={(option) => (option.name ? option.name : '')}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                inputValue={deliverySearchKey}
                onInputChange={(event, newInputValue) => {
                  setDeliverySearchKey(newInputValue);
                }}
                id="controllable-states-demo"
                options={getCancelReasonsQuery?.data?.data?.cancelReason || []}
                // options={cancelReasons.length > 0 ? cancelReasons.filter((item) => item?.type === 'butler') : []}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a cancel reason"
                    value={orderCancel.cancelReasonId}
                    required={!isOtherReason}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                    {option?.name}
                  </Box>
                )}
              />

              <div className="mt-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOtherReason}
                      onChange={(e) => setIsOtherReason(e.target.checked)}
                      name="otherReason"
                    />
                  }
                  label="Send other reason"
                />
              </div>

              {orderCancel?.refundType === 'partial' && (
                <RefundOrder
                  orderPayment={orderPayment}
                  orderCancel={orderCancel}
                  updateRefundAmount={updateRefundAmount}
                />
                // <CancelOrderRefunds>
                //   {/* <input
                //       type="number"
                //       className="form-control refund_input"
                //       placeholder="Enter Admin Amount"
                //       min={0}
                //       max={orderPayment?.admin}
                //       onChange={updateRefundAmount}
                //       name="admin"
                //       value={orderCancel?.partialPayment?.admin}
                //     /> */}
                //   <StyledFormField
                //     label={<span>Lyxa Earning: {orderPayment?.admin}</span>}
                //     intputType="text"
                //     containerProps={{
                //       sx: {
                //         padding: '14px 0px 23px 0',
                //         flex: '1',
                //       },
                //     }}
                //     inputProps={{
                //       value: orderCancel?.partialPayment?.admin,
                //       min: 0,
                //       type: 'number',
                //       name: 'admin',
                //       placeholder: 'Enter Admin Amount',
                //       onChange: updateRefundAmount,
                //     }}
                //   />
                //   {/* <span>Lyxa Earning: {orderPayment?.admin}</span> */}

                //   {orderCancel?.shop?._id && (
                //     <div className="refund_item_wrapper">
                //       {/* <input
                //         type="number"
                //         className="form-control refund_input"
                //         placeholder="Enter Shop Amount"
                //         min={0}
                //         max={orderPayment?.shop}
                //         onChange={updateRefundAmount}
                //         name="shop"
                //         value={orderCancel?.partialPayment?.shop}
                //       />
                //       <span>Shop Earning: {orderPayment?.shop}</span> */}
                //       <StyledFormField
                //         label={<span>Shop Earning: {orderPayment?.shop}</span>}
                //         intputType="text"
                //         containerProps={{
                //           sx: {
                //             padding: '14px 0px 23px 0',
                //             flex: '1',
                //           },
                //         }}
                //         inputProps={{
                //           value: orderCancel?.partialPayment?.shop,
                //           type: 'number',
                //           min: 0,
                //           name: 'shop',
                //           placeholder: 'Enter Shop Amount',
                //           onChange: updateRefundAmount,
                //         }}
                //       />
                //     </div>
                //   )}
                // </CancelOrderRefunds>
              )}
              <h5>
                Total Refund Amount:{' '}
                {orderCancel.refundType === 'full'
                  ? Number(orderCancel?.summary?.cash) +
                      Number(orderCancel?.summary?.wallet) +
                      Number(orderCancel?.summary?.card) || 0
                  : Number(orderCancel?.partialPayment?.admin) + Number(orderCancel?.partialPayment?.deliveryBoy || 0)}
              </h5>

              <div className="d-flex justify-content-center my-3 pt-3">
                <Button fullWidth variant="contained" className="px-4" type="submit" disabled={ordersQuery.isLoading}>
                  Confirm
                </Button>
              </div>
            </Form>
          </Box>
        </Paper>
      </Modal>

      {/* Refund Order */}

      <Modal
        open={openRefundModal}
        onClose={() => {
          setOpenRefundModal(!openRefundModal);
        }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
          }}
        >
          <Box padding={5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h3">Refund Order</Typography>
              <CloseButton
                onClick={() => {
                  setOpenRefundModal(!openRefundModal);
                }}
              />
            </Stack>
            <Form onSubmit={submitOrderRefund}>
              {/* <Autocomplete
                className="cursor-pointer mt-3"
                disabled={isOtherReason}
                value={orderCancel.cancelReasonId}
                onChange={(event, newValue) => {
                  setOrderCancel({
                    ...orderCancel,
                    cancelReasonId: newValue,
                    otherReason: '',
                  });
                }}
                getOptionLabel={(option) => (option.name ? option.name : '')}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                inputValue={deliverySearchKey}
                onInputChange={(event, newInputValue) => {
                  setDeliverySearchKey(newInputValue);
                }}
                id="controllable-states-demo"
                options={getCancelReasonsQuery?.data?.data?.cancelReason || []}
                // options={cancelReasons.length > 0 ? cancelReasons.filter((item) => item?.type === 'butler') : []}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a cancel reason"
                    value={orderCancel.cancelReasonId}
                    required={!isOtherReason}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                    {option?.name}
                  </Box>
                )}
              /> */}

              {/* <div className="mt-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOtherReason}
                      onChange={(e) => setIsOtherReason(e.target.checked)}
                      name="otherReason"
                    />
                  }
                  label="Send other reason"
                />
              </div> */}

              {/* {isOtherReason && (
                <div className="mt-2">
                  <TextField
                    type="text"
                    multiline
                    className="form-control"
                    placeholder="Type other reason"
                    maxRows={4}
                    required={isOtherReason}
                    label="Other reason"
                    value={orderCancel.otherReason}
                    onChange={(e) =>
                      setOrderCancel({
                        ...orderCancel,
                        otherReason: e.target.value,
                        cancelReasonId: null,
                      })
                    }
                  />
                </div>
              )} */}

              <FormControl className="py-3">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={orderCancel?.refundType}
                  onChange={(e) => updateRefundType(e.target.value)}
                  required
                >
                  <>
                    <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                    {orderCancel?.deliveryBoy?._id && (
                      <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                    )}
                  </>
                </RadioGroup>
              </FormControl>
              {orderCancel?.refundType === 'partial' && (
                <RefundOrder
                  orderPayment={orderPayment}
                  orderCancel={orderCancel}
                  updateRefundAmount={updateRefundAmount}
                />
                // <CancelOrderRefunds>
                //   {/* <input
                //       type="number"
                //       className="form-control refund_input"
                //       placeholder="Enter Admin Amount"
                //       min={0}
                //       max={orderPayment?.admin}
                //       onChange={updateRefundAmount}
                //       name="admin"
                //       value={orderCancel?.partialPayment?.admin}
                //     /> */}
                //   <StyledFormField
                //     label={<span>Lyxa Earning: {orderPayment?.admin}</span>}
                //     intputType="text"
                //     containerProps={{
                //       sx: {
                //         padding: '14px 0px 23px 0',
                //         flex: '1',
                //       },
                //     }}
                //     inputProps={{
                //       value: orderCancel?.partialPayment?.admin,
                //       min: 0,
                //       type: 'number',
                //       name: 'admin',
                //       placeholder: 'Enter Admin Amount',
                //       onChange: updateRefundAmount,
                //     }}
                //   />
                //   {/* <span>Lyxa Earning: {orderPayment?.admin}</span> */}

                //   {orderCancel?.shop?._id && (
                //     <div className="refund_item_wrapper">
                //       {/* <input
                //         type="number"
                //         className="form-control refund_input"
                //         placeholder="Enter Shop Amount"
                //         min={0}
                //         max={orderPayment?.shop}
                //         onChange={updateRefundAmount}
                //         name="shop"
                //         value={orderCancel?.partialPayment?.shop}
                //       />
                //       <span>Shop Earning: {orderPayment?.shop}</span> */}
                //       <StyledFormField
                //         label={<span>Shop Earning: {orderPayment?.shop}</span>}
                //         intputType="text"
                //         containerProps={{
                //           sx: {
                //             padding: '14px 0px 23px 0',
                //             flex: '1',
                //           },
                //         }}
                //         inputProps={{
                //           value: orderCancel?.partialPayment?.shop,
                //           type: 'number',
                //           min: 0,
                //           name: 'shop',
                //           placeholder: 'Enter Shop Amount',
                //           onChange: updateRefundAmount,
                //         }}
                //       />
                //     </div>
                //   )}
                // </CancelOrderRefunds>
              )}
              <h5>
                Total Refund Amount:{' '}
                {orderCancel.refundType === 'full'
                  ? Number(orderCancel?.summary?.cash) +
                      Number(orderCancel?.summary?.wallet) +
                      Number(orderCancel?.summary?.card) || 0
                  : Number(orderCancel?.partialPayment?.admin) + Number(orderCancel?.partialPayment?.shop || 0)}
              </h5>

              <div className="d-flex justify-content-center my-3 pt-3">
                <Button
                  fullWidth
                  variant="contained"
                  className="px-4"
                  type="submit"
                  disabled={refundOrderMutation?.isLoading}
                >
                  Confirm
                </Button>
              </div>
            </Form>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
