import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
// eslint-disable-next-line import/no-named-as-default

import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function ShopsFinancialsTable({ data = [], loading, viewUserType }) {
  const { dispatchCurrentUser, general } = useGlobalContext();

  const routeMatch = useRouteMatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const theme = useTheme();
  const currency = general?.currency?.symbol;
  const history = useHistory();

  const gotToShopTrxs = (shopId, shopName) => {
    history.push({
      pathname: `/app-wallet/shop-transactions`,
      search: `?shopId=${shopId}&shopName=${shopName}&sellerId=${searchParams.get(
        // eslint-disable-next-line prettier/prettier
        'sellerId',
      )}&companyName=${searchParams.get('companyName')}`,
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
                color: viewUserType === 'admin' ? theme.palette.primary.main : undefined,
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                if (viewUserType !== 'admin') return;
                e.stopPropagation();

                history.push({
                  pathname: `/shop/profile/${params?.row?._id}`,
                  state: {
                    from: `${routeMatch?.path}?sellerId=${searchParams.get('sellerId')}&companyName=${searchParams.get(
                      // eslint-disable-next-line prettier/prettier
                      'companyName',
                    )}`,
                    backToLabel: 'Back to Seller Transaction',
                  },
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
      renderCell: (params) => {
        const totalProductAmount = params?.row?.summary?.orderValue?.productAmount;
        const totalDiscount = params?.row?.summary?.orderValue?.totalDiscount;
        const totalRewardAmount = params?.row?.summary?.orderValue?.totalRewardAmount;
        const totalRewards = totalDiscount + totalRewardAmount;
        const results = totalProductAmount - totalRewards;
        return (
          <Typography variant="body1">
            {currency}
            {(results || 0).toFixed(2)}
          </Typography>
        );
      },
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
      renderCell: (params) => {
        const totalDropGet = params?.row?.summary?.totalDropGet;
        const pointsCashback = params?.row?.summary?.orderValue?.pointsCashback;
        const lyxaProfit = totalDropGet + pointsCashback;
        return (
          <Typography variant="body1">
            {lyxaProfit < 0 ? '-' : ''}
            {currency}
            {Math.abs(lyxaProfit || 0)?.toFixed(2)}
          </Typography>
        );
      },
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
          {params?.row?.summary?.totalShopEarning < 0 ? '-' : ''}
          {currency}
          {Math.abs(params?.row?.summary?.totalShopEarning || 0).toFixed(2)}
        </Typography>
      ),
    },
  ];
  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        // maxHeight: '480px',
        // overflow: 'auto',
        marginBottom: '40px',
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
