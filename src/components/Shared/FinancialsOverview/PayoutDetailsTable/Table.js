import { Box, Stack, Typography } from '@mui/material';
import TablePagination from '../../../Common/TablePagination';
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import StyledTable from '../../../Styled/StyledTable3';
import StyledBox from '../../../StyledCharts/StyledBox';
import SummaryItem from './SummaryItem';
import TableAccordion from './TableAccordion';

export default function Table({ currencyType, loading, rows = [], page, setPage, totalPage }) {
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
      id: 2,
      headerName: `ORDER AMOUNT`,
      sortable: false,
      field: 'orderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.baseCurrency_orderAmount}
                  valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount}
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Cash"
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_cash}
                value={financialBreakdown?.baseCurrency_orderAmount_cash}
              />
              <SummaryItem
                console={console.log({ financialBreakdown })}
                label="Online"
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_online}
                value={financialBreakdown?.baseCurrency_orderAmount_online}
              />
              <SummaryItem
                label="Discount"
                currencyType={currencyType}
                isNegative
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_discount}
                value={financialBreakdown?.baseCurrency_orderAmount_discount}
              />
              <SummaryItem
                label="Buy 1 Get 1"
                isNegative
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_buy1Get1}
                value={financialBreakdown?.baseCurrency_orderAmount_buy1Get1}
              />
              <SummaryItem
                label="Loyalty points"
                isNegative
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_loyaltyPoints}
                value={financialBreakdown?.baseCurrency_orderAmount_loyaltyPoints}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 3,
      headerName: `LYXA FEES`,
      sortable: false,
      field: 'lyxaFess',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={Math.abs(row?.financialBreakdown?.baseCurrency_lyxaFees)}
          valueSecondary={Math.abs(row?.financialBreakdown?.secondaryCurrency_lyxaFees)}
          isNegative={row?.financialBreakdown?.baseCurrency_lyxaFees > 0}
        />
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
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.financialBreakdown?.baseCurrency_totalVat}
          valueSecondary={row?.financialBreakdown?.secondaryCurrency_totalVat}
        />
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
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.baseCurrency_otherPayments}
                  valueSecondary={financialBreakdown?.secondaryCurrency_otherPayments}
                  isNegative={financialBreakdown?.baseCurrency_otherPayments > 0}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Free delivery"
                value={financialBreakdown?.baseCurrency_otherPayments_freeDelivery}
                valueSecondary={financialBreakdown?.secondaryCurrency_otherPayments_freeDelivery}
                isNegative
              />
              <SummaryItem
                label="Refunded Amount"
                currencyType={currencyType}
                isNegative
                value={financialBreakdown?.baseCurrency_otherPayments_refundAmount}
                valueSecondary={financialBreakdown?.secondaryCurrency_otherPayments_refundAmount}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 7,
      headerName: `DELIVERY FEE`,
      sortable: false,
      field: 'deliveryFee',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.baseCurrency_deliveryFee}
                  valueSecondary={financialBreakdown?.secondaryCurrency_deliveryFee}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Cash"
                value={financialBreakdown?.baseCurrency_deliveryFee_cash}
                valueSecondary={financialBreakdown?.secondaryCurrency_deliveryFee_cash}
              />
              <SummaryItem
                label="Online"
                currencyType={currencyType}
                value={financialBreakdown?.baseCurrency_deliveryFee_online}
                valueSecondary={financialBreakdown?.secondaryCurrency_deliveryFee_online}
              />
              <SummaryItem
                label="Rider tip"
                currencyType={currencyType}
                value={financialBreakdown?.baseCurrency_riderTip}
                valueSecondary={financialBreakdown?.secondaryCurrency_riderTip}
                isRejected
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 7,
      headerName: `POINTS CASHBACK`,
      sortable: false,
      field: 'pointsCashback',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.baseCurrency_pointsCashback}
          valueSecondary={row?.secondaryCurrency_pointsCashback}
          showIfZero
        />
      ),
    },
    {
      id: 8,
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.financialBreakdown?.baseCurrency_totalProfit}
          valueSecondary={row?.financialBreakdown?.secondaryCurrency_totalProfit}
          showIfZero
        />
      ),
    },
  ];

  if (loading) return <TableSkeleton columns={['text', 'text', 'text', 'text', 'text', 'text']} rows={5} />;

  return (
    <>
      <StyledBox
        padding
        sx={{
          marginTop: '20px',
          paddingTop: '3px',
          paddingBottom: '10px',
          overflow: 'visible',
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

              '& .MuiDataGrid-virtualScroller': {
                overflow: 'visible !important',
              },

              '& .MuiDataGrid-main': {
                overflow: 'visible !important',
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
      <TablePagination currentPage={page} lisener={setPage} totalPage={totalPage} />
    </>
  );
}
