/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TablePagination from '../../../components/Common/TablePagination';
import SummaryItem from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/SummaryItem';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';

export default function Table({ currencyType, loading, rows = [], page, setPage, totalPage }) {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const columns = [
    // {
    //   id: 1,
    //   headerName: 'ORDERS',
    //   field: 'orders',
    //   flex: 1.5,
    //   sortable: false,
    //   minWidth: 240,
    //   renderCell: ({ row }) => {
    //     console.log('user?._id', row);

    //     return (
    //       <UserAvatar
    //         imgAlt="user-image"
    //         imgUrl={row?.user?.profile_photo}
    //         imgFallbackCharacter={(row?.user?.name || 'USER')?.charAt(0)}
    //         name={
    //           <span>
    //             {row?.user?.name || 'Sohidul Islam'}
    //             {row?.chats?.length || row?.admin_chat_request?.length ? (
    //               <>
    //                 &nbsp;&nbsp;
    //                 <MessageIcon color="#5BBD4E" />
    //               </>
    //             ) : null}
    //             {row?.flag?.length ? (
    //               <>
    //                 &nbsp;&nbsp;
    //                 <FlagIcon color="#DD5B63" />
    //               </>
    //             ) : null}
    //           </span>
    //         }
    //         subTitle={row?.orderId || 'USD7987979797'}
    //         subTitleProps={{
    //           sx: { color: 'primary.main', cursor: 'pointer' },
    //           // onClick: () => {
    //           //   setCurrentOrder(row);
    //           //   setDetailOpen(true);
    //           // },
    //         }}
    //         titleProps={{
    //           sx: { color: 'primary.main', cursor: 'pointer' },
    //           onClick: () => {
    //             history.push({
    //               pathname: `/users/${row?.user?._id}`,
    //               state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
    //             });
    //           },
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      id: 1,
      headerName: 'ORDER ID',
      field: 'orders',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
      renderCell: ({ row }) => <Typography variant="body4">{row?.orderId}</Typography>,
    },
    {
      id: 2,
      headerName: `Total Order Amount`,
      sortable: false,
      field: 'totalOrderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.totalOrderAmount}
            valueSecondary={financialBreakdown?.totalOrderAmount}
            showIfZero
          />
        );
      },
    },
    {
      id: 2,
      headerName: `Rider Payout`,
      sortable: false,
      field: 'riderPayout',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.riderPayout}
            valueSecondary={financialBreakdown?.riderPayout}
            isNegative
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
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;
        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.adminButlerProfit}
            valueSecondary={financialBreakdown?.adminButlerProfit}
            showIfZero
          />
        );
      },
    },
  ];

  if (loading) return <TableSkeleton columns={['text', 'text', 'text', 'text']} rows={5} />;

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
