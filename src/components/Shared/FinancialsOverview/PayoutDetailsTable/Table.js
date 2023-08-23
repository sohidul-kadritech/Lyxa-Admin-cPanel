/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import StyledTable from '../../../Styled/StyledTable3';
import StyledBox from '../../../StyledCharts/StyledBox';
import SummaryItem from './SummaryItem';
import TableAccordion from './TableAccordion';

export default function Table({ currencyType, loading, rows = [] }) {
  const { general } = useGlobalContext();

  const baseCurrency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.symbol;

  const isBase = currencyType === 'baseCurrency';
  const currency = currencyType === 'baseCurrency' ? baseCurrency : secondaryCurrency;

  console.log({ rows });

  const columns = [
    {
      id: 1,
      headerName: `ORDER ID`,
      sortable: false,
      field: 'orderId',
      flex: 1,

      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 1,
      headerName: `ORDER AMOUNT`,
      sortable: false,
      field: 'orderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;
        const value = isBase
          ? financialBreakdown?.baseCurrency_orderAmount
          : financialBreakdown?.secondaryCurrency_orderAmount;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion title={value}>
              <SummaryItem
                currency={currency}
                label="Cash"
                value={
                  isBase
                    ? financialBreakdown?.baseCurrency_orderAmount_cash
                    : financialBreakdown?.secondaryCurrency_orderAmount_cash
                }
              />
              <SummaryItem
                currency={currency}
                label="Online"
                value={
                  isBase
                    ? financialBreakdown?.baseCurrency_orderAmount_online
                    : financialBreakdown?.secondaryCurrency_deliveryFee_online
                }
              />
              <SummaryItem
                currency={currency}
                label="Discount"
                isNegative
                value={
                  isBase
                    ? financialBreakdown?.baseCurrency_orderAmount_discount
                    : financialBreakdown?.secondaryCurrency_orderAmount_discount
                }
              />
              <SummaryItem
                currency={currency}
                label="Buy 1 Get 1"
                isNegative
                value={
                  isBase
                    ? financialBreakdown?.baseCurrency_orderAmount_buy1Get1
                    : financialBreakdown?.secondaryCurrency_orderAmount_buy1Get1
                }
              />
              <SummaryItem
                currency={currency}
                label="Loyalty points"
                isNegative
                value={
                  isBase
                    ? financialBreakdown?.baseCurrency_orderAmount_loyaltyPoints
                    : financialBreakdown?.baseCurrency_orderAmount_loyaltyPoints
                }
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 2,
      headerName: `LYXA FEES`,
      sortable: false,
      field: 'lyxaFess',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase
            ? `${row?.adminCharge?.baseCurrency_adminChargeFromOrder}`
            : `${row?.adminCharge?.secondaryCurrency_adminChargeFromOrder}`}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: `TOTAL VAT`,
      sortable: false,
      field: 'totalVat',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase ? `${row?.vatAmount?.baseCurrency_vatForShop}` : `${row?.vatAmount?.secondaryCurrency_vatForShop}`}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: `OTHER PAYMENTS`,
      sortable: false,
      field: 'otherPayments',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: () => (
        <Typography variant="body4">
          {currency} {0}
        </Typography>
      ),
    },
    {
      id: 6,
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase
            ? `${row?.baseCurrency_shopEarnings - row?.vatAmount?.baseCurrency_vatForShop}`
            : `${row?.secondaryCurrency_shopEarnings - row?.vatAmount?.secondaryCurrency_vatForShop}`}
        </Typography>
      ),
    },
  ];

  if (loading) return <TableSkeleton columns={['text', 'text', 'text', 'text', 'text', 'text']} rows={5} />;

  return (
    <StyledBox
      padding
      sx={{
        marginTop: '20px',
        paddingTop: '3px',
        paddingBottom: '10px',
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        scrollbarHeight: 'thin',

        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
      }}
    >
      <Box
        sx={{
          minWidth: '1070px',
        }}
      >
        <StyledTable
          autoHeight
          columns={columns}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell': {
              overflow: 'visible',
            },
          }}
          rows={rows}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No data found
              </Stack>
            ),
          }}
        />
      </Box>
    </StyledBox>
  );
}
