import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import StyledTable from '../../../components/Styled/StyledTable3';

function SellerFinancialsTable({ data = [], loading }) {
  const allColumns = [
    {
      id: 1,
      headerName: `SELLER NAME`,
      field: 'title',
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {params?.row?.company_name}
            </Typography>
            <Typography
              variant="body3"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
            >
              {params?.row?.autoGenId}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `ORDERS`,
      field: 'order',
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {params?.row?.summary?.totalOrder}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 4,
      field: 'order_amount',
      headerName: 'ORDER AMOUNT',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body1"> {params?.row?.summary?.orderValue?.productAmount}</Typography>
      ),
    },
    {
      id: 4,
      field: 'delivery_fee',
      headerName: 'DELIVERY FEE($)',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <Typography variant="body1"> {params?.row?.summary?.orderValue?.deliveryFee}</Typography>,
    },
    {
      id: 4,
      field: 'lyxa_profit',
      headerName: 'Lyxa Profit($)',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <Typography variant="body1">{params?.row?.summary?.totalDropGet}</Typography>,
    },
    {
      id: 4,
      field: 'seller_profit',
      headerName: 'SELLER PROFIT($)',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body1">{new Date(row?.createdAt || undefined).toLocaleDateString()}</Typography>
      ),
    },
  ];
  return (
    <Box>
      <StyledTable
        columns={allColumns}
        rows={data}
        getRowId={(row) => row?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'defualt',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? 'Loading...' : 'No Notification Found'}
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default SellerFinancialsTable;
