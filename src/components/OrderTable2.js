/* eslint-disable consistent-return */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// third party
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
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
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'reactstrap';
import styled from 'styled-components';
import { butlerOrderUpdateStatus, orderStatusOptions } from '../assets/staticData';
import { successMsg } from '../helpers/successMsg';

// project import
import * as Api from '../network/Api';
import AXIOS from '../network/axios';
import { cancelButlerOrderByAdmin, updateButlerOrderIsCancelled } from '../store/Butler/butlerActions';
import { cancelOrderByAdmin } from '../store/order/orderAction';
import { getAllCancelReasons } from '../store/Settings/settingsAction';
import CloseButton from './Common/CloseButton';
import TableLoader from './Common/TableLoader';
import OptionsSelect from './Form/OptionsSelect';
import StyledTable from './StyledTable';
import ThreeDotsMenu from './ThreeDotsMenu';

// add order flag
const getOrderStatus = (statusName) => {
  switch (statusName) {
    case 'accepted_delivery_boy':
      return 'Accept by rider';

    case 'preparing':
      return 'Accept by shop';

    case 'ready_to_pickup':
      return 'Ready to pickup';

    case 'order_on_the_way':
      return 'On the way';

    case 'delivered':
      return 'Delivered';

    case 'cancelled':
      return 'Cancelled';

    case 'refused':
      return 'Refused';

    default:
      return 'Placed';
  }
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

// get order update status options
const updateOrderStatusOptions = (currentOrder) => {
  // butler
  if (currentOrder?.isButler) {
    return butlerOrderUpdateStatus.filter((item) => item.value !== currentOrder?.orderStatus);
  }

  // self shop
  if (currentOrder?.shop?.haveOwnDeliveryBoy) {
    return orderStatusOptions.filter(
      (item) => item.value !== 'ready_to_pickup' || item.value !== currentOrder?.orderStatus
    );
  }

  // regular order
  return orderStatusOptions.filter((item) => item.value !== currentOrder?.orderStatus);
};

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

export default function ButlerOrderTable({ orders, loading, onRowClick }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { cancelReasons } = useSelector((state) => state.settingsReducer);
  const { isCanceled } = useSelector((state) => state.butlerReducer);
  const { status } = useSelector((store) => store.butlerReducer);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { account_type } = useSelector((store) => store.Login.admin);
  const { socket } = useSelector((state) => state.socketReducer);

  const [currentOrder, setCurrentOrder] = useState({});
  const [currentOrderShop, setCurrentOrderShop] = useState({});
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState({});

  // flag order
  const [flagModal, setFlagModal] = useState(false);
  const [flagType, setFlagType] = useState([]);
  const [flagComment, setFlagComment] = useState('');

  const flagOptions = useMemo(() => getFlagOptions(currentOrder), [currentOrder]);

  const handleFlagTypeChange = (value) => {
    if (flagType.includes(value)) {
      setFlagType((prev) => prev.filter((val) => val !== value));
    } else {
      setFlagType((prev) => [...prev, value]);
    }
  };

  const resetFlagModal = () => {
    setFlagModal(false);
    setFlagType([]);
    setFlagComment('');
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
    }
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

    addFlagMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  // update order status
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');

  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

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
    }
  );

  const resetUpdateStatusModal = () => {
    setUpdateStatusModal(false);
    setNewOrderStatus('');
    setCurrentButlerSearchKey('');
    setCurrentOrderDelivery({});
    setCurrentOrder({});
    setCurrentOrderShop({});
  };

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
    }
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

  // cancel order
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderCancel, setOrderCancel] = useState(cancelOrderInit);
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);
  const [orderPayment, setOrderPayment] = useState({
    deliveryBoy: 0,
    admin: 0,
  });

  const getThreedotMenuOptions = (orderStatus) => {
    const options = [];
    const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

    if (hideUpdateAndCanelOption.indexOf(orderStatus) < 0) {
      options.push('Update Status');
    }

    if (account_type === 'admin') {
      options.push('Flag');
      options.push('Cancel Order');
    }

    return options;
  };

  const threeDotHandler = (menu, order) => {
    if (menu === 'Flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'Cancel Order') {
      setCurrentOrder(order);
      setOpenCancelModal(!openCancelModal);

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
        });
      }
    }
    if (menu === 'Update Status') {
      setUpdateStatusModal(true);
      setCurrentOrder(order);
      setCurrentOrderShop(order?.shop);
      setCurrentOrderDelivery(order?.deliveryBoy || {});
    }
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Customer',
      field: 'user',
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            {params?.row?.user?.profile_photo ? (
              <Avatar alt="C" src={params?.row?.user?.profile_photo} sx={{ width: 60, height: 60 }} />
            ) : (
              <Avatar sx={{ width: 60, height: 60 }}>C</Avatar>
            )}
          </Box>
          <Stack spacing={2}>
            <Typography className="text-capitalize" variant="body2">
              {params?.row?.user?.name}
            </Typography>
            <Typography variant="body3">{params?.row?.orderId}</Typography>
            {!params?.row?.isButler && <Typography variant="body3">{params?.row?.shop?.shopName}</Typography>}
          </Stack>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Order Date',
      field: 'createdAt',
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Stack width="100%" spacing={2} alignItems="center">
          <Typography variant="body1">{new Date(row?.createdAt).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(row?.createdAt).toLocaleTimeString()}</Typography>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `Amount (${currency})`,
      sortable: false,
      field: 'summary',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body1">{params?.row?.summary?.totalAmount + params?.row?.summary?.vat}</Typography>
      ),
    },
    {
      id: 4,
      headerName: 'Payment method',
      sortable: false,
      flex: 1,
      field: 'paymentMethod',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <span className="text-capitalize">{`${params?.row?.paymentMethod} ${
          params?.row?.selectPos !== 'no' ? '(Pos)' : ''
        }`}</span>
      ),
    },
    {
      id: 5,
      headerName: 'Order Status',
      sortable: false,
      field: 'orderStatus',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const status = getOrderStatus(params?.row?.orderStatus);
        return (
          <Chip
            label={status}
            color={status === 'Cancelled' || status === 'Refused' ? 'primary' : 'success'}
            sx={
              status === 'Cancelled' || status === 'Refused'
                ? { background: '#ffcfce', color: '#ff0000' }
                : { background: '#e1f4d0', color: '#56ca00' }
            }
            variant="contained"
          />
        );
      },
    },
    {
      id: 6,
      headerName: 'Action',
      sortable: false,
      flex: 1,
      field: 'action',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <ThreeDotsMenu
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params.row);
          }}
          menuItems={getThreedotMenuOptions(params?.row?.orderStatus)}
        />
      ),
    },
  ];

  // CANCEL ORDER
  const submitOrderCancel = (e) => {
    e.preventDefault();

    const {
      partialPayment: { deliveryBoy, admin, shop },
    } = orderCancel;

    if (currentOrder?.isButler) {
      if (orderCancel.refundType === 'partial' && !deliveryBoy && !admin) {
        return successMsg('Enter Minimum One Partial Amount');
      }
      const data = {
        ...orderCancel,
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      dispatch(cancelButlerOrderByAdmin(data));
    } else {
      if (orderCancel.refundType === 'partial' && !shop && !deliveryBoy && !admin) {
        return successMsg('Enter Minimum One Partial Amount');
      }

      const data = {
        ...orderCancel,
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      dispatch(cancelOrderByAdmin(data));
    }
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
      return successMsg('Invalid Lyxa Amount');
    }
    if (name === 'deliveryBoy' && Number(value) > deliveryBoy) {
      return successMsg('Invalid Delivery Boy Amount');
    }

    if (shop && name === 'shop' && Number(value) > shop) {
      return successMsg('Invalid Shop Amount');
    }

    setOrderCancel({
      ...orderCancel,
      partialPayment: {
        ...orderCancel?.partialPayment,
        [name]: Number(value),
      },
    });
  };

  // GET ALL CANCEL REASON
  useEffect(() => {
    dispatch(getAllCancelReasons(true));
  }, []);

  useEffect(() => {
    if (status) {
      setOpenCancelModal(false);
    }
  }, [status]);

  useEffect(() => {
    if (isCanceled) {
      dispatch(updateButlerOrderIsCancelled(false));
    }
  }, [isCanceled]);

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledTable
        columns={columns}
        rows={orders || []}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
          },
        }}
        getRowId={(row) => row?._id}
        rowHeight={73}
        onRowClick={(params) => {
          if (onRowClick) {
            onRowClick(params);
          }
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? '' : 'No Order found'}
            </Stack>
          ),
        }}
      />
      {/* loading */}
      {loading && <TableLoader />}
      {/* update order status modal */}
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
                    <MenuItem key={item.value} value={item.value}>
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
                disabled={loading}
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
                    // disableMultiple={getDisabledFlagOptions(currentOrder?.flag || [])}
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
                options={cancelReasons.length > 0 ? cancelReasons.filter((item) => item?.type === 'butler') : []}
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
                        cancelReasonId: null,
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
                  onChange={(e) => updateRefundType(e.target.value)}
                  required
                >
                  {orderCancel?.paymentMethod !== 'cash' && (
                    <>
                      <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                      {orderCancel?.deliveryBoy?._id && (
                        <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                      )}
                    </>
                  )}
                  <FormControlLabel value="none" control={<Radio />} label="No Refund" />
                </RadioGroup>
              </FormControl>
              {orderCancel?.refundType === 'partial' && (
                <CancelOrderRefunds>
                  <div className="refund_item_wrapper">
                    <input
                      type="number"
                      className="form-control refund_input"
                      placeholder="Enter Admin Amount"
                      min={0}
                      max={orderPayment?.admin}
                      onChange={updateRefundAmount}
                      name="admin"
                      value={orderCancel?.partialPayment?.admin}
                    />
                    <span>Lyxa Earning: {orderPayment?.admin}</span>
                  </div>
                  {orderCancel?.deliveryBoy?._id && (
                    <div className="refund_item_wrapper">
                      <input
                        type="number"
                        className="form-control refund_input"
                        placeholder="Enter Delivery Amount"
                        min={0}
                        max={orderPayment?.deliveryBoy}
                        onChange={updateRefundAmount}
                        name="deliveryBoy"
                        value={orderCancel?.partialPayment?.deliveryBoy}
                      />
                      <span>Delivery Earning: {orderPayment?.deliveryBoy}</span>
                    </div>
                  )}
                  {orderCancel?.shop?._id && (
                    <div className="refund_item_wrapper">
                      <input
                        type="number"
                        className="form-control refund_input"
                        placeholder="Enter Shop Amount"
                        min={0}
                        max={orderPayment?.shop}
                        onChange={updateRefundAmount}
                        name="shop"
                        value={orderCancel?.partialPayment?.shop}
                      />
                      <span>Shop Earning: {orderPayment?.shop}</span>
                    </div>
                  )}
                </CancelOrderRefunds>
              )}
              <h5>
                Total Refund Amount:{' '}
                {Number(orderCancel?.partialPayment?.admin) + Number(orderCancel?.partialPayment?.deliveryBoy)}
              </h5>

              <div className="d-flex justify-content-center my-3 pt-3">
                <Button fullWidth variant="contained" className="px-4" type="submit" disabled={loading}>
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
