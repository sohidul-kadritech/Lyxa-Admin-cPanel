/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
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

export default function ButlerOrderTable({ orders, loading }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { account_type } = useSelector((store) => store.Login.admin);

  const getThreedotMenuOptions = (orderStatus) => {
    const options = [];
    const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

    if (hideUpdateAndCanelOption.indexOf(orderStatus) < 0) {
      options.push('Update Status');
      options.push('Cancel Order');
    }

    if (account_type === 'admin') {
      options.push('Flag');
    }

    return options;
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Customer',
      field: 'user',
      minWidth: 300,
      flex: 1,
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
      minWidth: 250,
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
      minWidth: 250,
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
      minWidth: 250,
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
      minWidth: 250,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const status = getOrderStatus(params?.row?.orderStatus);
        return (
          <Chip
            label={status}
            color={status === 'Cancelled' || status === 'Refused' ? 'primary' : 'success'}
            variant="contained"
          />
        );
      },
    },
    {
      id: 6,
      headerName: 'Action',
      sortable: false,
      minWidth: 200,
      field: 'action',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <ThreeDotsMenu handleMenuClick={() => {}} menuItems={getThreedotMenuOptions(params?.row?.orderStatus)} />
      ),
    },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledTable
        columns={columns}
        rows={orders || []}
        getRowId={(row) => row?._id}
        rowHeight={71}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? '' : 'No Q&A found'}
            </Stack>
          ),
        }}
      />
      {/* loading */}
      {loading && <TableLoader />}
    </Box>
  );
}
