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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { butlerOrderStatusOptionsForAdminUpdate } from '../assets/staticData';
import { successMsg } from '../helpers/successMsg';

// project import
import { NEAR_BY_BUTLERS_FOR_ORDER } from '../network/Api';
import requestApi from '../network/httpRequest';
import { updateButlerOrderStatus } from '../store/Butler/butlerActions';
import TableLoader from './Common/TableLoader';
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

export default function ButlerOrderTable({ orders, loading, onRowClick }) {
  const dispatch = useDispatch();

  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  // eslint-disable-next-line no-unused-vars
  const { account_type } = useSelector((store) => store.Login.admin);

  // update order status
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newOrderStatus, setOrderStatus] = useState('');
  const [currentOrder, setCurrentOrder] = useState({});
  const [nearByBulters, setNearByBulters] = useState([]);
  const [nearByButlersIsLoading, setNearByButlersIsLoading] = useState(false);
  const [currentButler, setCurrentButler] = useState({});
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');

  const handleOrderStatusChange = async (newStatus) => {
    setOrderStatus(newStatus);
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

    dispatch(updateButlerOrderStatus({}));
  };

  // eslint-disable-next-line no-unused-vars
  const getThreedotMenuOptions = (orderStatus) =>
    // const options = [];
    // const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

    // if (hideUpdateAndCanelOption.indexOf(orderStatus) < 0) {
    //   options.push('Update Status');
    //   options.push('Cancel Order');
    // }

    // if (account_type === 'admin') {
    //   options.push('Flag');
    // }

    ['Update Status'];
  const threeDotHandler = (menu, order) => {
    if (menu === 'Flag') {
      setCurrentOrder(order);
    }
    if (menu === 'Update Status') {
      setCurrentOrder(order);
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
          setUpdateStatusModal(false);
          setOrderStatus('');
        }}
      >
        <Paper
          sx={{
            minWidth: 'max(35vw, 450px)',
          }}
        >
          <Box padding={5}>
            <Typography variant="h3" mb={8}>
              Update Order Status
            </Typography>
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
                  {butlerOrderStatusOptionsForAdminUpdate.map((item) => (
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
    </Box>
  );
}
