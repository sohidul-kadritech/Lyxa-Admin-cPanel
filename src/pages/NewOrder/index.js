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
  Tooltip,
  Typography,
} from '@mui/material';

// project import
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'reactstrap';
import styled from 'styled-components';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
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
import {
  calculateTotalRefund,
  calculateTotalRefundedAmount,
  getAdminRefundedAmount,
  getQueryParamsInit,
  getRefundedVatForAdmin,
  returnNewValue,
} from './helpers';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import StyledFormField from '../../components/Form/StyledFormField';

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

function TitleWithToolTip({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Tooltip
        arrow
        title={tooltip}
        sx={{
          '.MuiTooltip-popper': {
            zIndex: '9999999 !important',
          },
        }}
      >
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}

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

  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentOrderShop, setCurrentOrderShop] = useState({});

  const [appVat, setAppVat] = useState(0);

  const [currentOrderDelivery, setCurrentOrderDelivery] = useState({});
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const [newRefundType, setNewRefundType] = useState('');
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
      setNewRefundType('');
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'cancel_order') {
      setNewRefundType('');
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
          orderFor: order?.orderFor,
          orderActivity: order?.orderActivity,
          paymentMethod: order?.paymentMethod,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          vatAmount: order?.vatAmount,
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
          orderFor: order?.orderFor,
          orderActivity: order?.orderActivity,
          paymentMethod: order?.paymentMethod,
          shop: order?.shop,
          orderId: order?._id,
          refundType: 'none',
          vatAmount: order?.vatAmount,
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
      setNewRefundType('delivered');
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
          orderActivity: order?.orderActivity,
          orderFor: order?.orderFor,
          orderId: order?._id,
          vatAmount: order?.vatAmount,
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
        console.log('order?.deliveryBoyFee', order?.deliveryBoyFee);
        setOrderCancel({
          ...orderCancel,
          cancelReasonId: '',
          otherReason: '',
          deliveryBoy: order?.deliveryBoy,
          paymentMethod: order?.paymentMethod,
          orderFor: order?.orderFor,
          orderActivity: order?.orderActivity,
          shop: order?.shop,
          orderId: order?._id,
          refundType: 'none',
          partialPayment: {
            deliveryBoy: '',
            admin: '',
          },
          vatAmount: order?.vatAmount,
          summary: order?.summary,
        });
      }
    }
    if (menu === 'update_status') {
      setNewRefundType('');
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

  // eslint-disable-next-line no-unused-vars
  const getAppSettingsData = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('app setttings; ', data?.data?.appSetting);
        setAppVat(data?.data?.appSetting?.vat);
      }
    },
  });

  // eslint-disable-next-line prettier/prettier, no-unused-vars
  const refundOrderMutation = useMutation((data) => AXIOS.post(Api.REFUND_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(Api.ORDER_LIST);
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

  const CancelOrderRefunds = styled.div`
    padding-bottom: 10px;
    .refund_item_wrapper {
      margin-bottom: 5px;
      display: flex;
      align-items: center;

      .refund_input {
        width: 180px;
        margin-right: 20px;
      }
    }
  `;

  // eslint-disable-next-line no-unused-vars
  const cancelOrderForButlarMutation = useMutation((data) => AXIOS.post(Api.BUTLER_CANCEL_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpenCancelModal(false);
        queryClient.invalidateQueries(Api.ORDER_LIST);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const cancelOrderByAdminMutation = useMutation((data) => AXIOS.post(Api.CANCEL_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpenCancelModal(false);
        queryClient.invalidateQueries(Api.ORDER_LIST);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

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
        // ...orderCancel,
        orderId: orderCancel?.orderId,
        otherReason: orderCancel?.otherReason,
        refundType: orderCancel?.refundType,
        partialPayment: {
          // eslint-disable-next-line no-unsafe-optional-chaining
          shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
          deliveryBoy: orderCancel?.partialPayment?.deliveryBoy ? orderCancel?.partialPayment?.deliveryBoy : 0,
          admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
          adminVat: getRefundedVatForAdmin(
            orderCancel?.vatAmount?.vatForAdmin,
            // eslint-disable-next-line no-unsafe-optional-chaining
            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
            // eslint-disable-next-line prettier/prettier
            appVat,
            // eslint-disable-next-line prettier/prettier
          ),
        },
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;
      // dispatch(cancelButlerOrderByAdmin(data));
      cancelOrderForButlarMutation.mutate(data);
    } else {
      if (orderCancel.refundType === 'partial' && !shop && !deliveryBoy && !admin) {
        successMsg('Enter Minimum One Partial Amount');
        return;
      }
      const data = {
        // ...orderCancel,
        orderId: orderCancel?.orderId,
        otherReason: orderCancel?.otherReason,
        refundType: orderCancel?.refundType,
        partialPayment:
          orderCancel?.refundType !== 'full'
            ? {
                shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
                deliveryBoy: orderCancel?.partialPayment?.deliveryBoy ? orderCancel?.partialPayment?.deliveryBoy : 0,
                admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
                adminVat: getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.vatForAdmin,
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                  // eslint-disable-next-line prettier/prettier
                  appVat,
                  // eslint-disable-next-line prettier/prettier
                ),
              }
            : {},
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      // dispatch(cancelOrderByAdmin(data));
      cancelOrderByAdminMutation.mutate(data);
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
      partialPayment:
        orderCancel?.refundType !== 'full'
          ? {
              shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
              admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
              adminVat: getRefundedVatForAdmin(
                orderCancel?.vatAmount?.vatForAdmin,
                // eslint-disable-next-line no-unsafe-optional-chaining
                orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                // eslint-disable-next-line prettier/prettier
                appVat,
                // eslint-disable-next-line prettier/prettier
              ),
            }
          : {},
    };

    delete data.deliveryBoy;

    refundOrderMutation.mutate(generatedData);
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
    const forShop =
      admin < 0
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          shop + orderCancel.vatAmount.vatForShop + deliveryBoy
        : shop + orderCancel.vatAmount.vatForShop;

    // const forAdmin = orderPayment?.admin < 0 ? 0 : admin + deliveryBoy;
    const forAdmin = getAdminRefundedAmount(admin, deliveryBoy, newRefundType);

    if (name === 'admin' && Number(value) > forAdmin) {
      successMsg('Invalid Lyxa Amount');
      return;
    }

    if (shop && name === 'shop' && Number(value) > forShop) {
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
      {/* Cancel order modal */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
            zIndex: '10 !important',
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
              {isOtherReason && (
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
                        cancelReason: null,
                      })
                    }
                  />
                </div>
              )}
              <FormControl className="py-3">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={orderCancel?.refundType}
                  onChange={(e) => {
                    updateRefundType(e.target.value);
                  }}
                  required
                >
                  {orderCancel?.paymentMethod !== 'cash' && (
                    <>
                      <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                      {((orderCancel?.orderFor === 'specific' && orderCancel?.orderActivity?.length > 1) ||
                        (orderCancel?.orderFor === 'global' && orderCancel?.orderActivity?.length > 2)) && (
                        <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                      )}
                      <FormControlLabel value="none" control={<Radio />} label="No Refund" />
                    </>
                  )}
                </RadioGroup>
              </FormControl>

              {orderCancel?.refundType === 'partial' && (
                <CancelOrderRefunds>
                  <StyledFormField
                    label={
                      <TitleWithToolTip
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        title={`Lyxa Refund: ${orderPayment?.admin < 0 ? 0 : orderPayment?.admin}`}
                        tooltip="Lyxa Earning"
                      />
                    }
                    intputType="text"
                    containerProps={{
                      sx: {
                        padding: '14px 0px 23px 0',
                        flex: '1',
                      },
                    }}
                    inputProps={{
                      value: orderCancel?.partialPayment?.admin,
                      min: 0,
                      type: 'number',
                      name: 'admin',
                      placeholder: 'Enter Admin Amount',
                      onChange: updateRefundAmount,
                    }}
                  />
                  {orderCancel?.shop?._id && (
                    <div className="refund_item_wrapper">
                      <StyledFormField
                        label={
                          <TitleWithToolTip
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            // title={`Shop Refund: ${orderPayment?.shop + orderCancel?.vatAmount?.vatForShop}`}
                            title={`Shop Refund: ${
                              // eslint-disable-next-line no-unsafe-optional-chaining
                              orderPayment?.admin < 0
                                ? // eslint-disable-next-line no-unsafe-optional-chaining
                                  orderPayment?.shop + orderCancel?.vatAmount?.vatForShop + orderPayment?.admin
                                : // eslint-disable-next-line no-unsafe-optional-chaining
                                  orderPayment?.shop + orderCancel?.vatAmount?.vatForShop
                            }`}
                            tooltip="Shop Earning+VAT"
                          />
                        }
                        intputType="text"
                        containerProps={{
                          sx: {
                            padding: '14px 0px 23px 0',
                            flex: '1',
                          },
                        }}
                        inputProps={{
                          value: orderCancel?.partialPayment?.shop,
                          type: 'number',
                          min: 0,
                          name: 'shop',
                          placeholder: 'Enter Shop Amount',
                          onChange: updateRefundAmount,
                        }}
                      />
                    </div>
                  )}

                  {orderCancel?.orderFor === 'global' && (
                    <div className="refund_item_wrapper">
                      <StyledFormField
                        label={<span>Delivery boy Earning: {orderPayment?.deliveryBoy}</span>}
                        intputType="text"
                        containerProps={{
                          sx: {
                            padding: '14px 0px 23px 0',
                            flex: '1',
                          },
                        }}
                        inputProps={{
                          value: orderCancel?.partialPayment?.deliveryBoy,
                          type: 'number',
                          min: 0,
                          max: orderPayment?.deliveryBoy,
                          name: 'deliveryBoy',
                          placeholder: 'Enter Delivery Amount',
                          onChange: updateRefundAmount,
                        }}
                      />
                    </div>
                  )}
                </CancelOrderRefunds>
              )}
              {/* <h5>
                <TitleWithToolTip
                  title={`Total Refund Amount:
                ${
                  orderCancel.refundType === 'none'
                    ? calculateTotalRefund([], 'none')
                    : orderCancel.refundType === 'full'
                    ? calculateTotalRefund(
                        [
                          Number(orderCancel?.summary?.cash),
                          Number(orderCancel?.summary?.wallet),
                          Number(orderCancel?.summary?.card),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'full',
                      )
                    : calculateTotalRefund(
                        [
                          Number(orderCancel?.partialPayment?.deliveryBoy),
                          Number(orderCancel?.partialPayment?.admin),
                          Number(orderCancel?.partialPayment?.shop),
                          getRefundedVatForAdmin(
                            orderCancel?.vatAmount?.vatForAdmin,
                            orderCancel?.partialPayment?.admin,
                            orderCancel?.partialPayment?.deliveryBoy,
                            // eslint-disable-next-line prettier/prettier
                            appVat,
                          ),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'partial',
                      )
                }`}
                  tooltip="Lyxa Earning+Lyxa Vat+Shop Earning+Shop VAT+Delivery Boy Earning"
                />
              </h5> */}
              <h5>
                <TitleWithToolTip
                  title={`Total Refund Amount:
                ${
                  orderCancel.refundType === 'full'
                    ? Number(orderCancel?.summary?.cash) +
                        Number(orderCancel?.summary?.wallet) +
                        Number(orderCancel?.summary?.card) || 0
                    : calculateTotalRefundedAmount(
                        Number(orderCancel?.partialPayment?.deliveryBoy),
                        Number(orderCancel?.partialPayment?.admin),
                        Number(orderCancel?.partialPayment?.shop),
                        getRefundedVatForAdmin(
                          orderCancel?.vatAmount?.vatForAdmin,
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                          // eslint-disable-next-line prettier/prettier
                          appVat,
                          // eslint-disable-next-line prettier/prettier
                        ),
                      ) || 0
                }`}
                  tooltip="Lyxa Earning+Lyxa Vat+Shop Earning+Shop VAT+Delivery Boy Earning"
                />
              </h5>

              {getRefundedVatForAdmin(
                orderCancel?.vatAmount?.vatForAdmin,
                // eslint-disable-next-line no-unsafe-optional-chaining
                orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                // eslint-disable-next-line prettier/prettier
                appVat,
              ) > 0 &&
                orderCancel.refundType !== 'full' &&
                orderPayment?.admin > 0 && (
                  <Typography variant="body1" fontWeight={600}>
                    Admin VAT Refunded:{' '}
                    {getRefundedVatForAdmin(
                      orderCancel?.vatAmount?.vatForAdmin,
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                      // eslint-disable-next-line prettier/prettier
                      appVat,
                    )}
                  </Typography>
                )}

              <div className="d-flex justify-content-center my-3 pt-3">
                <Button
                  fullWidth
                  variant="contained"
                  className="px-4"
                  type="submit"
                  disabled={cancelOrderByAdminMutation?.isLoading || cancelOrderForButlarMutation?.isLoading}
                >
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
        sx={{ zIndex: '10 !important' }}
      >
        <Paper
          sx={{
            minWidth: 'max(40vw, 500px)',
            zIndex: '10 !important',
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
                <CancelOrderRefunds>
                  <StyledFormField
                    label={
                      <TitleWithToolTip
                        title={`Lyxa Refund: ${
                          orderPayment?.admin < 0
                            ? returnNewValue(orderPayment?.deliveryBoy) || 0
                            : // eslint-disable-next-line no-unsafe-optional-chaining
                              orderPayment?.admin + orderPayment?.deliveryBoy
                        }`}
                        tooltip="Lyxa Earning+Rider Earning"
                      />
                    }
                    intputType="text"
                    containerProps={{
                      sx: {
                        padding: '14px 0px 23px 0',
                        flex: '1',
                      },
                    }}
                    inputProps={{
                      value: orderCancel?.partialPayment?.admin,
                      min: 0,
                      type: 'number',
                      name: 'admin',
                      placeholder: 'Enter Admin Amount',
                      onChange: updateRefundAmount,
                    }}
                  />
                  {/* <span>Lyxa Earning: {orderPayment?.admin}</span> */}

                  {orderCancel?.shop?._id && (
                    <div className="refund_item_wrapper">
                      <StyledFormField
                        label={
                          <TitleWithToolTip
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            // title={`Shop Refund: ${orderPayment?.shop + orderCancel?.vatAmount?.vatForShop}`}
                            title={`Shop Refund: ${
                              orderPayment?.admin < 0
                                ? calculateTotalRefund([
                                    orderPayment?.shop,
                                    orderCancel?.vatAmount?.vatForShop,
                                    orderPayment?.admin,
                                  ])
                                : calculateTotalRefund([orderPayment?.shop, orderCancel?.vatAmount?.vatForShop])
                            }`}
                            tooltip="Shop Earning+Shop VAT"
                          />
                        }
                        intputType="text"
                        containerProps={{
                          sx: {
                            padding: '14px 0px 23px 0',
                            flex: '1',
                          },
                        }}
                        inputProps={{
                          value: orderCancel?.partialPayment?.shop,
                          type: 'number',
                          min: 0,
                          name: 'shop',
                          placeholder: 'Enter Shop Amount',
                          onChange: updateRefundAmount,
                        }}
                      />
                    </div>
                  )}
                </CancelOrderRefunds>
              )}
              {orderCancel.refundType !== 'none' && (
                // <h5>
                //   Total Refund Amount:{' '}
                //   {orderCancel.refundType === 'full'
                //     ? Number(orderCancel?.summary?.cash) +
                //         Number(orderCancel?.summary?.wallet) +
                //         Number(orderCancel?.summary?.card) || 0
                //     : Number(orderCancel?.partialPayment?.admin) + Number(orderCancel?.partialPayment?.shop || 0)}
                // </h5>
                <>
                  <h5>
                    <TitleWithToolTip
                      title={`Total Refund Amount:
                ${
                  orderCancel.refundType === 'none'
                    ? calculateTotalRefund([], 'none')
                    : orderCancel.refundType === 'full'
                    ? calculateTotalRefund(
                        [
                          Number(orderCancel?.summary?.cash),
                          Number(orderCancel?.summary?.wallet),
                          Number(orderCancel?.summary?.card),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'full',
                      )
                    : calculateTotalRefund(
                        [
                          Number(orderCancel?.partialPayment?.admin),
                          Number(orderCancel?.partialPayment?.shop),
                          getRefundedVatForAdmin(
                            orderCancel?.vatAmount?.vatForAdmin,
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                            // eslint-disable-next-line prettier/prettier
                            appVat,
                          ),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'partial',
                      )
                }`}
                      tooltip="Lyxa Earning+Lyxa VAT+Shop Earning+Shop VAT+Rider Earning+Rider VAT"
                    />
                  </h5>
                  {getRefundedVatForAdmin(
                    orderCancel?.vatAmount?.vatForAdmin,
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                    // eslint-disable-next-line prettier/prettier
                    appVat,
                  ) > 0 &&
                    orderCancel.refundType !== 'full' && (
                      <Typography variant="body1" fontWeight={600}>
                        Admin VAT Refunded:{' '}
                        {getRefundedVatForAdmin(
                          orderCancel?.vatAmount?.vatForAdmin,
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                          // eslint-disable-next-line prettier/prettier
                          appVat,
                        )}
                      </Typography>
                    )}
                </>
              )}

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
