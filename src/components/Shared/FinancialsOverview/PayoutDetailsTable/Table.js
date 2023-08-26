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
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={isPartialRefund ? 0 : financialBreakdown?.baseCurrency_orderAmount}
                  valueSecondary={isPartialRefund ? 0 : financialBreakdown?.secondaryCurrency_orderAmount}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Cash"
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_cash}
                value={financialBreakdown?.baseCurrency_orderAmount_cash}
                hide={isPartialRefund}
              />

              <SummaryItem
                console={console.log({ financialBreakdown })}
                label="Online"
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_online}
                value={financialBreakdown?.baseCurrency_orderAmount_online}
                hide={isPartialRefund}
              />

              <SummaryItem
                label="Discount"
                currencyType={currencyType}
                isNegative
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_discount}
                value={financialBreakdown?.baseCurrency_orderAmount_discount}
                hide={isPartialRefund}
              />

              <SummaryItem
                label="Buy 1 Get 1"
                isNegative
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_buy1Get1}
                value={financialBreakdown?.baseCurrency_orderAmount_buy1Get1}
                hide={isPartialRefund}
              />

              <SummaryItem
                label="Loyalty points"
                isNegative
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_loyaltyPoints}
                value={financialBreakdown?.baseCurrency_orderAmount_loyaltyPoints}
                hide={isPartialRefund}
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
      renderCell: ({ row }) => {
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={isPartialRefund ? 0 : Math.abs(row?.financialBreakdown?.baseCurrency_lyxaFees)}
            valueSecondary={isPartialRefund ? 0 : Math.abs(row?.financialBreakdown?.secondaryCurrency_lyxaFees)}
            isNegative={row?.financialBreakdown?.baseCurrency_lyxaFees > 0}
            showIfZero
          />
        );
      },
    },
    {
      id: 4,
      headerName: `TOTAL VAT`,
      sortable: false,
      field: 'totalVat',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={isPartialRefund ? 0 : row?.financialBreakdown?.baseCurrency_totalVat}
            valueSecondary={isPartialRefund ? 0 : row?.financialBreakdown?.secondaryCurrency_totalVat}
            showIfZero
          />
        );
      },
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
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={Math.abs(financialBreakdown?.baseCurrency_otherPayments)}
                  valueSecondary={Math.abs(financialBreakdown?.secondaryCurrency_otherPayments)}
                  isNegative={financialBreakdown?.baseCurrency_otherPayments > 0}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Free delivery"
                value={isPartialRefund ? 0 : financialBreakdown?.baseCurrency_otherPayments_freeDelivery}
                valueSecondary={isPartialRefund ? 0 : financialBreakdown?.secondaryCurrency_otherPayments_freeDelivery}
                isNegative
                hide={isPartialRefund}
              />

              <SummaryItem
                label="Refunded Amount"
                currencyType={currencyType}
                isNegative={financialBreakdown?.baseCurrency_otherPayments_refundAmount > 0}
                value={Math.abs(financialBreakdown?.baseCurrency_otherPayments_refundAmount)}
                valueSecondary={Math.abs(financialBreakdown?.secondaryCurrency_otherPayments_refundAmount)}
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

      renderCell: ({ row }) => {
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={isPartialRefund ? 0 : row?.baseCurrency_pointsCashback}
            valueSecondary={isPartialRefund ? 0 : row?.secondaryCurrency_pointsCashback}
            showIfZero
          />
        );
      },
    },
    {
      id: 8,
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const isPartialRefund = row?.userCancelTnx?.[0]?.isPartialRefund || row?.userRefundTnx?.[0]?.isPartialRefund;
        const financialBreakdown = row?.financialBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={
              isPartialRefund
                ? Math.abs(financialBreakdown?.baseCurrency_otherPayments_refundAmount)
                : financialBreakdown?.baseCurrency_totalProfit
            }
            valueSecondary={
              isPartialRefund
                ? Math.abs(financialBreakdown?.secondaryCurrency_otherPayments_refundAmount)
                : financialBreakdown?.secondaryCurrency_totalProfit
            }
            showIfZero
          />
        );
      },
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
