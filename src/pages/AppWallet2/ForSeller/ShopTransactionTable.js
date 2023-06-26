import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import { useHistory } from 'react-router-dom';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function ShopTransactionTable({ data = [], loading }) {
  // eslint-disable-next-line no-unused-vars
  const { currentUser, dispatchCurrentUser, dispatchShopTabs, general } = useGlobalContext();
  const theme = useTheme();
  const currency = general?.currency?.symbol;
  const history = useHistory();
  const gotToShopTrxs = (shopId, shopName) => {
    history.push({
      pathname: `/add-wallet/shop-transactions`,
      search: `?shopId=${shopId}&shopName=${shopName}`,
    });
  };
  const allColumns = [
    {
      id: 1,
      headerName: `Trx ID`,
      field: 'title',
      flex: 1,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
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
      headerName: `AMOUNT`,
      field: 'amount',
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
      field: 'TRANSACTION TYPE',
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
      id: 3,
      field: 'DATE',
      headerName: 'date',
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
      headerName: `Admin (${currency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency} {params?.row?.summary?.orderValue?.deliveryFee}
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

export default ShopTransactionTable;
