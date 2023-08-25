import { Box, Stack, Typography } from '@mui/material';
import TablePagination from '../../../components/Common/TablePagination';
import SummaryItem from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/SummaryItem';
import TableAccordion from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/TableAccordion';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';

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
      headerName: `DELIVERY PROFIT`,
      sortable: false,
      field: 'totalVat',
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
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                showIfZero
                label="Cash"
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_cash}
                value={financialBreakdown?.baseCurrency_orderAmount_cash}
              />
              <SummaryItem
                label="Online"
                currencyType={currencyType}
                showIfZero
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_online}
                value={financialBreakdown?.baseCurrency_orderAmount_online}
              />
              <SummaryItem
                label="Rider Cut"
                currencyType={currencyType}
                showIfZero
                isNegative
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_discount}
                value={financialBreakdown?.baseCurrency_orderAmount_discount}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 8,
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
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
