import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';

import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { HeaderWithToolTips } from './helpers';

function SellerFinancialsTable({ data = [], loading, currentPage, setPage, totalPage }) {
  const { general } = useGlobalContext();
  const routeMatch = useRouteMatch();
  const theme = useTheme();
  console.log('data', data);
  const currency = general?.currency?.symbol;

  const history = useHistory();

  const sellerShopsTrxs = (sellerId, companyName) => {
    history.push({
      pathname: `/app-wallet/seller/shops-transactions`,
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
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/seller/list/${params?.row?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Seller Transactions' },
                });
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
      field: 'order_amount',
      headerName: (
        <HeaderWithToolTips title={`ORDER AMOUNT (${currency})`} tooltip="Amount of orders without delivery fee" />
      ),
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
      headerName: <HeaderWithToolTips title={`DELIVERY FEE (${currency})`} tooltip="Order delivery fee" />,
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
      headerName: <HeaderWithToolTips title={`LYXA PROFIT (${currency})`} tooltip="Previously lyxa earning" />,
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
      field: 'total_unsettle_amount',
      headerName: (
        <HeaderWithToolTips title={`UNSETTLED AMOUNT (${currency})`} tooltip="Amount of orders without delivery fee" />
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
      align: 'right',
      headerAlign: 'right',
      headerName: (
        <HeaderWithToolTips
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
          {params?.row?.summary?.totalSellerEarning < 0 ? '-' : ''}
          {currency}
          {Math.abs(params?.row?.summary?.totalSellerEarning || 0).toFixed(2)}
        </Typography>
      ),
    },
  ];
  return (
    <>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns}
          rows={data}
          onRowClick={({ row }) => {
            sellerShopsTrxs(row?._id, row?.company_name);
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
                {loading ? 'Loading...' : 'No Transaction Found'}
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={currentPage}
        lisener={(page) => {
          setPage(page);
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default SellerFinancialsTable;
