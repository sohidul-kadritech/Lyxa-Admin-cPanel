/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// third party
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { butlerOrderStatusOptionsForAdminUpdate } from '../assets/staticData';
import { successMsg } from '../helpers/successMsg';

// project import
import { NEAR_BY_BUTLERS_FOR_ORDER } from '../network/Api';
import requestApi from '../network/httpRequest';
import {
  addButlerOrderFlag,
  updateButlerOrderIsFlagged,
  updateButlerOrderIsUpdated,
  updateButlerOrderStatus,
} from '../store/Butler/butlerActions';
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
const fetchNearByButlers = async (orderId) => {
  try {
    const { data } = await requestApi().request(NEAR_BY_BUTLERS_FOR_ORDER, {
      method: 'GET',
      params: {
        orderId,
      },
    });

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
  });

  console.log({ flags });
  console.log({ list });

  return list;
};

export default function ButlerOrderTable({ orders, loading, onRowClick }) {
  const dispatch = useDispatch();

  const { isUpdated, isFlagged } = useSelector((store) => store.butlerReducer);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { account_type } = useSelector((store) => store.Login.admin);

  // update order status
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentOrder, setCurrentOrder] = useState({});
  const [nearByBulters, setNearByBulters] = useState([]);
  const [nearByButlersIsLoading, setNearByButlersIsLoading] = useState(false);
  const [currentButler, setCurrentButler] = useState({});
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');

  // flag order
  const [flagModal, setFlagModal] = useState(false);
  const [flagType, setFlagType] = useState([]);
  const [flagComment, setFlagComment] = useState('');

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
        const data = await fetchNearByButlers(currentOrder?._id);
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

    if (newOrderStatus === 'accepted_delivery_boy') {
      data.deliveryBoy = currentButler?._id;
    }

    dispatch(updateButlerOrderStatus(data));
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
    data.comment = flagComment;

    if (flagType.includes('user')) {
      data.user = currentOrder?.user?._id;
    }

    if (flagType.includes('delivery')) {
      data.delivery = currentOrder?.user?._id;
    }

    dispatch(addButlerOrderFlag(data));
  };

  const getThreedotMenuOptions = (orderStatus) => {
    const options = [];
    const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

    if (hideUpdateAndCanelOption.indexOf(orderStatus) < 0) {
      options.push('Update Status');
      // options.push('Cancel Order');
    }

    if (account_type === 'admin') {
      options.push('Flag');
    }

    return options;
  };

  const threeDotHandler = (menu, order) => {
    setCurrentOrder(order);

    if (menu === 'Flag') {
      setFlagModal(true);
    }
    if (menu === 'Update Status') {
      setUpdateStatusModal(true);
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
      renderCell: (params) => (
        <Stack width="100%" spacing={2} alignItems="center">
          <Typography variant="body1">{new Date(params?.row?.createdAt).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(params?.row?.createdAt).toLocaleTimeString()}</Typography>
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
        rowHeight={71}
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
                  {butlerOrderStatusOptionsForAdminUpdate
                    .filter((item) => item.value !== currentOrder?.orderStatus)
                    .map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {/* near by delivery boys */}
              <Autocomplete
                className={`${newOrderStatus === 'accepted_delivery_boy' ? '' : 'd-none'}`}
                value={currentButler._id ? currentButler : null}
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
            {currentOrder?.flag?.length === 2 ? (
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
                    items={flagTypeOptions.filter(
                      (item) => currentOrder?.deliveryBoy?._id || item.value !== 'delivery'
                    )}
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
    </Box>
  );
}
