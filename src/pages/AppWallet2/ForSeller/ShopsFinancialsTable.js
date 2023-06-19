import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default

import { useHistory, useRouteMatch } from 'react-router-dom';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function ShopsFinancialsTable({ data = [], loading }) {
  // eslint-disable-next-line no-unused-vars
  const { currentUser, dispatchCurrentUser, dispatchShopTabs, general } = useGlobalContext();
  const routeMatch = useRouteMatch();
  console.log('routeMatch', routeMatch);
  const theme = useTheme();
  const currency = general?.currency?.symbol;
  const history = useHistory();
  const gotToShopTrxs = (shopId, shopName) => {
    history.push({
      pathname: `/add-wallet/shop-transactions2`,
      search: `?shopId=${shopId}&shopName=${shopName}`,
    });
  };
  const allColumns = [
    {
      id: 1,
      headerName: `SHOP NAME`,
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
              onClick={(e) => {
                e.stopPropagation();
                history.push({
                  pathname: `/shop/profile/${params?.row?._id}`,
                  state: { from: `${routeMatch?.path}`, backToLabel: 'Back to Financials' },
                });
                dispatchCurrentUser({ type: 'shop', payload: { shop: { ...params?.row } } });
              }}
            >
              {params?.row?.shopName}
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
      headerName: 'ORDER AMOUNT',
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {' '}
          {currency}
          {params?.row?.summary?.orderValue?.productAmount}
        </Typography>
      ),
    },
    {
      id: 4,
      field: 'delivery_fee',
      headerName: `DELIVERY FEE (${currency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency} {params?.row?.summary?.orderValue?.deliveryFee}
        </Typography>
      ),
    },
    {
      id: 5,
      field: 'lyxa_profit',
      headerName: `LYXA PROFIT (${currency})`,
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
      headerName: `UNSETTLED AMOUNT (${currency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.summary?.totalShopUnsettle.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 7,
      field: 'shop_profit',
      align: 'right',
      headerAlign: 'right',
      headerName: `SHOP PROFIT (${currency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.summary?.totalShopEarning}
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
        onRowClick={({ row }) => {
          gotToShopTrxs(row?._id, row?.shopName);
        }}
        getRowId={(row) => row?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? 'Loading...' : 'No Shop Found'}
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default ShopsFinancialsTable;
