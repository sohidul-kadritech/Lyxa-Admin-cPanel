import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import { useHistory } from 'react-router-dom';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { HeaderWith } from './helpers';

function SellerFinancialsTable({ data = [], loading }) {
  const { general } = useGlobalContext();
  const theme = useTheme();
  const currency = general?.currency?.symbol;

  const history = useHistory();

  const sellerShopsTrxs = (sellerId, companyName) => {
    history.push({
      pathname: `/app-wallet/seller/shops-transactions2`,
      search: `?sellerId=${sellerId}&companyName=${companyName}`,
    });
  };
  const allColumns = [
    {
      id: 1,
      headerName: `SELLER NAME`,
      field: 'title',
      flex: 1,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{
                color: theme.palette.primary.main,
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={() => {
                sellerShopsTrxs(params?.row?._id, params?.row?.company_name);
              }}
            >
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
      headerName: <HeaderWith title="ORDERS" tooltip="Number of orders" />,
      field: 'order',
      flex: 1,
      sortable: false,
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
      id: 3,
      field: 'order_amount',
      headerName: <HeaderWith title={`ORDER AMOUNT (${currency})`} tooltip="Amount of orders without delivery fee" />,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {' '}
          {currency}
          {params?.row?.summary?.orderValue?.productAmount.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 4,
      field: 'delivery_fee',
      headerName: <HeaderWith title={`DELIVERY FEE (${currency})`} tooltip="Order delivery fee" />,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {' '}
          {currency}
          {params?.row?.summary?.orderValue?.deliveryFee.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 5,
      field: 'lyxa_profit',
      headerName: <HeaderWith title={`LYXA PROFIT (${currency})`} tooltip="Previously lyxa earning" />,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.summary?.totalDropGet.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'total_unsettle_amount',
      headerName: (
        <HeaderWith title={`UNSETTLED AMOUNT (${currency})`} tooltip="Amount of orders without delivery fee" />
      ),

      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.summary?.totalSellerUnsettle.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 7,
      field: 'seller_profit',
      headerName: (
        <HeaderWith
          title={`SELLER PROFIT (${currency})`}
          tooltip={
            <Typography>
              Paid (seller earning) Unpaid (unsettled){' '}
              <Box component="span" sx={{ color: '#FF0000' }}>
                (previously unsettled)
              </Box>
            </Typography>
          }
        />
      ),

      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.summary?.totalSellerEarning.toFixed(2)}
        </Typography>
      ),
    },
  ];
  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        maxHeight: '480px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
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
