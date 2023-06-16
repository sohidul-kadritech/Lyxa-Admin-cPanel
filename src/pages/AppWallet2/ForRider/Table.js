import { Box, Stack, Typography, useTheme } from '@mui/material';
// eslint-disable-next-line import/no-named-as-default
import { useHistory } from 'react-router-dom';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { HeaderWithToolTips } from '../ForSeller/helpers';

function RiderFinancialsTable({ data = [], loading }) {
  const { general } = useGlobalContext();
  // eslint-disable-next-line import/no-named-as-default

  const theme = useTheme();
  const currency = general?.currency?.symbol;

  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const sellerShopsTrxs = (sellerId, companyName) => {
    history.push({
      pathname: `/app-wallet/seller/shops-transactions2`,
      search: `?sellerId=${sellerId}&companyName=${companyName}`,
    });
  };
  //   trx?.name,
  //   trx?.summary?.orderValue?.count ?? 0,
  //   trx?.summary?.totalDeliveyFee,
  //   trx?.summary?.dropEarning,
  //   trx?.summary?.totalUnSettleAmount,
  //   trx?.summary?.riderEarning,
  //   trx?.summary.totalCashInHand,
  //   trx?.summary.settleAmount,

  const allColumns = [
    {
      id: 1,
      headerName: `RIDER NAME`,
      field: 'name',
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
                history?.push(`/riders/${params?.row?._id}`);
              }}
            >
              {params?.row?.name}
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
      headerName: <HeaderWithToolTips title="ORDERS" tooltip="Number of orders" />,
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
      field: 'delivery_fee',
      headerName: <HeaderWithToolTips title={`DELIVERY FEE (${currency})`} tooltip="Order delivery fee" />,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {' '}
          {currency}
          {(params?.row?.summary?.totalDeliveyFee || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 4,
      field: 'lyxa_profit',
      headerName: <HeaderWithToolTips title={`LYXA PROFIT (${currency})`} tooltip="Previously lyxa earning" />,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {' '}
          {currency}
          {(params?.row?.summary?.dropEarning || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 5,
      field: 'unsettled_amount',
      headerName: (
        <HeaderWithToolTips
          title={`UNSETTLED AMOUNT (${currency})`}
          tooltip="Paid 
      Unpaid"
        />
      ),
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {(params?.row?.summary?.totalUnSettleAmount || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'cash_order',
      headerName: (
        <HeaderWithToolTips
          title={`CASH ORDER (${currency})`}
          tooltip="Cash in hand
        settled cash"
        />
      ),

      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {(params?.row?.summary.totalCashInHand || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'settled_cash',
      headerName: (
        <HeaderWithToolTips
          title={`SETTLED CASH (${currency})`}
          tooltip="Cash in hand
        settled cash"
        />
      ),

      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {(params?.row?.summary?.settleAmount || 0).toFixed(2)}
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
          history?.push(`/riders/${row?._id}`);
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
              {loading ? 'Loading...' : 'No Seller Found'}
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default RiderFinancialsTable;
