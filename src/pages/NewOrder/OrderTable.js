// third party

// project import
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTable from '../../components/Styled/StyledTable3';
import { orderStatusMap, statusColorVariants } from './helpers';

export default function OrderTable({ orders = [], onRowClick }) {
  const columns = [
    {
      id: 1,
      headerName: 'ORDERS',
      field: 'orders',
      flex: 1,
      sortable: false,
      minWidth: 270,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" gap={5}>
          <Avatar alt="user-image" src={row?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
            {row?.user?.name[0]}
          </Avatar>
          <Stack gap={1.5}>
            <Typography variant="body4">{row?.user?.name}</Typography>
            <Typography
              variant="body4"
              sx={{
                fontSize: '13px',
                lineHeight: '15px',
                color: '#737373',
              }}
            >
              {row?.orderId}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: 'DATE',
      field: 'createdAt',
      minWidth: 240,
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{moment(value).format('MMM D, YYYY h:mm a')}</Typography>,
    },
    {
      id: 4,
      headerName: 'STATUS',
      field: 'orderStatus',
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => (
        <Chip
          label={orderStatusMap[value || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[value] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      headerName: 'PROFIT',
      field: 'profit',
      sortable: false,
      flex: 1,
      renderCell: () => <Typography variant="body4">$230.00</Typography>,
    },
  ];

  return (
    <Box
      sx={{
        pr: 5,
        pl: 3.5,
        pt: 1,
        pb: 1,
        border: '1px solid #EEEEEE',
        borderRadius: '7px',
        background: '#fff',
      }}
    >
      <StyledTable
        columns={columns}
        rows={orders}
        getRowId={(row) => row?._id}
        rowHeight={71}
        onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />
    </Box>
  );
}
