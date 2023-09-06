/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

const getCurrencyValue = (baseCurrency, secondaryCurrency, baseAmount = 0, secondaryAmount = 0) => {
  const baseValue = Number(baseAmount || 0);
  const secondaryValue = Math.round(Number(secondaryAmount || 0));

  const baseValueWithCurrency =
    baseValue < 0
      ? `-${baseCurrency} ${Math.abs(baseValue).toFixed(2)}`
      : `${baseCurrency} ${Math.abs(baseValue).toFixed(2)}`;
  const secondaryValueWithCurrency =
    secondaryValue < 0
      ? `-${secondaryCurrency} ${Math.abs(secondaryValue)}`
      : `${secondaryCurrency} ${Math.abs(secondaryValue)}`;

  const joinCurrencyValue = `${baseValueWithCurrency} + ${secondaryValueWithCurrency}`;

  return {
    baseValueWithCurrency,
    secondaryValueWithCurrency,
    joinAmount: joinCurrencyValue,
    print: secondaryValue > 0 ? joinCurrencyValue : baseValueWithCurrency,
  };
};

function RiderFinancialsTable({ data = [], loading, currentPage, setCurrentPage, totalPage }) {
  const { general } = useGlobalContext();
  const theme = useTheme();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const routeMatch = useRouteMatch();
  const history = useHistory();

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
                history?.push({
                  pathname: `/riders/${params?.row?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Rider Financials' },
                });
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
      headerName: `LYXA DELIVERY CUT (${secondaryCurrency})`,
      // headerName: <HeaderWithToolTips title="ORDERS" tooltip="Number of orders" />,
      field: 'order',
      flex: 1,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {
                getCurrencyValue(currency, secondaryCurrency, 0, params?.row?.profitBreakdown?.totalDeliveryFee)
                  .secondaryValueWithCurrency
              }
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 3,
      field: 'delivery_fee',
      headerName: `LXYA DELIVERY PROFIT (${secondaryCurrency})`,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(currency, secondaryCurrency, 0, params?.row?.profitBreakdown?.adminDeliveryProfit)
              .secondaryValueWithCurrency
          }
        </Typography>
      ),
    },
    {
      id: 4,
      field: 'lyxa_profit',
      headerName: `RIDER TIPS (${secondaryCurrency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(currency, secondaryCurrency, 0, params?.row?.profitBreakdown?.riderTips)
              .secondaryValueWithCurrency
          }
        </Typography>
      ),
    },
    {
      id: 5,
      field: 'unsettled_amount',
      headerName: `RIDER CREDIT (${secondaryCurrency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(currency, secondaryCurrency, 0, params?.row?.profitBreakdown?.riderAddRemoveCredit)
              .secondaryValueWithCurrency
          }
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'cash_order',
      headerName: `RIDER PAYOUTS (${secondaryCurrency})`,

      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(currency, secondaryCurrency, 0, params?.row?.profitBreakdown?.riderPayout)
              .secondaryValueWithCurrency
          }
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'settled_cash',
      align: 'right',
      headerAlign: 'right',
      headerName: `CASH IN HAND`,

      sortable: false,
      flex: 1.3,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(
              currency,
              secondaryCurrency,
              params?.row?.profitBreakdown?.cashInHand?.baseCurrency_CashInHand,
              params?.row?.profitBreakdown?.cashInHand?.secondaryCurrency_CashInHand,
            ).joinAmount
          }
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
            history?.push({
              pathname: `/riders/${row?._id}`,
              search: 'financials=riders',
              state: { from: routeMatch?.path, backToLabel: 'Back to Rider Financials' },
            });
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
          setCurrentPage(page);
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default RiderFinancialsTable;
