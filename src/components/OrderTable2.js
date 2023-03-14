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
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'reactstrap';
import styled from 'styled-components';
import { butlerOrderUpdateStatus, orderStatusOptions } from '../assets/staticData';
import { successMsg } from '../helpers/successMsg';

// project import
import { ACTIVE_DEIVERY_BOYS, NEAR_BY_BUTLERS_FOR_ORDER } from '../network/Api';
import requestApi from '../network/httpRequest';
import {
  addButlerOrderFlag,
  cancelButlerOrderByAdmin,
  updateButlerOrderIsCancelled,
  updateButlerOrderIsFlagged,
  updateButlerOrderIsUpdated,
  updateButlerOrderStatus,
} from '../store/Butler/butlerActions';
import { cancelOrderByAdmin, orderUpdateStatus, sentOrderFlag } from '../store/order/orderAction';
import { getAllCancelReasons } from '../store/Settings/settingsAction';
import CloseButton from './Common/CloseButton';
import TableLoader from './Common/TableLoader';
import OptionsSelect from './Form/OptionsSelect';
import StyledTable from './StyledTable';
import ThreeDotsMenu from './ThreeDotsMenu';

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

// fetch nearby deliveryboys
const fetchNearByButlers = async (orderId, isButler) => {
  let api = ACTIVE_DEIVERY_BOYS;

  if (isButler) {
    api = NEAR_BY_BUTLERS_FOR_ORDER;
  }

  try {
    const { data } = await requestApi().request(api, {
      method: 'GET',
      params: {
        orderId,
      },
    });

    console.log(data);

    if (data?.status) {
      return data?.data?.nearByDeliveryBoys;
    }
    successMsg(data?.message || 'No butlers found');
    return [];
  } catch (error) {
    console.log(error);
    successMsg(error?.message || 'No butlers found');
    return [];
  }
};

// flag type options
const flagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Butler', value: 'delivery' },
];

// order flag type options
const orderFlagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Butler', value: 'delivery' },
  { label: 'Shop', value: 'shop' },
];

// disabled flag options
const getDisabledFlagOptions = (flags) => {
  const list = [];

  flags.forEach((item) => {
    if (item.user) {
      list.push('user');
    }
    if (item.delivery) {
      list.push('delivery');
    }
    if (item.shop) {
      list.push('shop');
    }
  });

  return list;
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

const getFlagTypeOptions = (currentOrder) => {
  if (currentOrder?.isButler) {
    return flagTypeOptions.filter((item) => currentOrder?.deliveryBoy?._id || item.value !== 'delivery');
  }
  return orderFlagTypeOptions;
};

export default function ButlerOrderTable({ orders, loading, onRowClick }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { cancelReasons } = useSelector((state) => state.settingsReducer);
  const { isCanceled } = useSelector((state) => state.butlerReducer);

  const { isUpdated, isFlagged, status } = useSelector((store) => store.butlerReducer);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { account_type } = useSelector((store) => store.Login.admin);
  const { socket } = useSelector((state) => state.socketReducer);

  // update order status
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentOrder, setCurrentOrder] = useState({});
  const [nearByBulters, setNearByBulters] = useState([]);
  const [nearByButlersIsLoading, setNearByButlersIsLoading] = useState(false);
  const [currentButler, setCurrentButler] = useState({});
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');
  const [currentOrderShop, setCurrentOrderShop] = useState({});

  // flag order
  const [flagModal, setFlagModal] = useState(false);
  const [flagType, setFlagType] = useState([]);
  const [flagComment, setFlagComment] = useState('');

  // cancel order
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderCancel, setOrderCancel] = useState(cancelOrderInit);
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);
  const [orderPayment, setOrderPayment] = useState({
    deliveryBoy: 0,
    admin: 0,
  });

  // handle flag type change
  const handleFlagTypeChange = (value) => {
    if (flagType.includes(value)) {
      setFlagType((prev) => prev.filter((val) => val !== value));
    } else {
      setFlagType((prev) => [...prev, value]);
    }
  };

  const handleOrderStatusChange = async (newStatus) => {
    setNewOrderStatus(newStatus);
    if (newStatus === 'accepted_delivery_boy') {
      try {
        setNearByButlersIsLoading(true);
        const data = await fetchNearByButlers(currentOrder?._id, currentOrder?.isButler);
        setNearByBulters(data);
        setNearByButlersIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateStatus = () => {
    if (newOrderStatus === '') {
      successMsg('Please select status');
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = newOrderStatus;
    data.deliveryBoy = '';

    if (currentOrder.isButler) {
      if (newOrderStatus === 'accepted_delivery_boy') {
        if (!currentButler?._id) {
          successMsg('Please select butler');
          return;
        }

        data.deliveryBoy = currentButler;
      }

      dispatch(updateButlerOrderStatus(data));
      queryClient.invalidateQueries(['all-orders']);
      return;
    }

    if (
      (newOrderStatus === 'delivered' || newOrderStatus === 'preparing') &&
      !currentButler?._id &&
      !currentOrder?.shop?.haveOwnDeliveryBoy
    ) {
      successMsg(`Assign delivery boy first`);
      return;
    }

    data.shop = currentOrderShop?._id;
    data.deliveryBoy = currentButler?._id;
    queryClient.invalidateQueries(['all-orders']);
    dispatch(orderUpdateStatus(data, socket));
    setUpdateStatusModal(false);
  };

  const addOrderFlag = () => {
    if (flagComment.trim() === '') {
      successMsg('Comment cannot be empty');
      return;
    }

    if (flagType.length === 0) {
      successMsg('User type cannot be empty');
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.comment = flagComment.trim();

    if (flagType.includes('user')) {
      data.user = currentOrder?.user?._id;
    }

    if (flagType.includes('delivery')) {
      data.delivery = currentOrder?.deliveryBoy?._id;
    }

    if (flagType.includes('shop')) {
      data.shop = currentOrder?.shop?._id;
    }

    if (currentOrder?.isButler) {
      dispatch(addButlerOrderFlag(data));
      queryClient.invalidateQueries(['all-orders']);
    } else {
      setFlagModal(false);
      dispatch(sentOrderFlag(data));
      queryClient.invalidateQueries(['all-orders']);
    }
  };

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
      setCurrentButler(order?.deliveryBoy || {});
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

  const resetUpdateStatusModal = () => {
    setUpdateStatusModal(false);
    setNewOrderStatus('');
    setCurrentButlerSearchKey('');
    setCurrentButler({});
  };

  const resetFlagModal = () => {
    setFlagModal(false);
    setFlagType([]);
    setFlagComment('');
  };

  // temp
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
    if (isUpdated) {
      resetUpdateStatusModal();
      dispatch(updateButlerOrderIsUpdated(false));
    }
    if (isFlagged) {
      resetFlagModal();
      dispatch(updateButlerOrderIsFlagged(false));
    }
  }, [isUpdated, isFlagged]);

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
        sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
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
                    handleOrderStatusChange(e.target.value);
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
              <Autocomplete
                className={`${newOrderStatus === 'accepted_delivery_boy' ? '' : 'd-none'}`}
                value={currentButler}
                disabled={nearByButlersIsLoading}
                onChange={(event, newValue) => {
                  console.log(newValue);
                  setCurrentButler(newValue);
                }}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                inputValue={currentButlerSearchKey}
                onInputChange={(event, newInputValue) => {
                  setCurrentButlerSearchKey(newInputValue);
                }}
                options={nearByBulters}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Select " />}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option._id}>
                    {option.name}
                  </Box>
                )}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={() => {
                  updateStatus();
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
        sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            {getFlagTypeOptions(currentOrder)?.length ===
            getDisabledFlagOptions(currentOrder?.flag || [])?.length >= 2 ? (
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
                    items={getFlagTypeOptions(currentOrder)}
                    onChange={handleFlagTypeChange}
                    disableMultiple={getDisabledFlagOptions(currentOrder?.flag || [])}
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
                  disabled={loading}
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
        sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
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
                  {console.log(orderCancel)}
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
