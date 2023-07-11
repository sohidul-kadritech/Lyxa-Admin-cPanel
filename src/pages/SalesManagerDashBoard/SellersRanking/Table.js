/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Rating from '../../../components/Common/Rating';
import UserAvatar from '../../../components/Common/UserAvatar';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function SellersRankingTable({ data = [], queryParams, setQueryParams, totalPage = 2, loading = false }) {
  const history = useHistory();
  const { general } = useGlobalContext();
  const routeMatch = useRouteMatch();

  const { currency } = general;
  const column = [
    {
      id: 1,
      headerName: '',
      field: 'rowNumber',
      flex: 1,
      sortable: false,
      maxWidth: 90,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: 'SalesName',
      field: 'salesName',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="logo"
          imgUrl={row?.profile_photo}
          imgStyle="circular"
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history?.push({
                pathname: `/shop/list/${row?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Shop List' },
              });
            },
          }}
          imgFallbackCharacter={row?.salesName?.charAt(0)}
          name={row?.salesName}
        />
      ),
    },
    {
      id: 4,
      sortable: false,
      headerName: 'SELLERS',
      // renderHeader: () => (
      //   <CommonHeader title="ORDERS" filter="sortByOrders" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'seller',
      flex: 1,
      renderCell: ({ row }) => <Typography variant="body4">{row?.seller}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: 'SHOPS',
      // renderHeader: () => (
      //   <CommonHeader title="ORDERS" filter="sortByOrders" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'shop',
      flex: 1,
      renderCell: ({ row }) => <Typography variant="body4">{row?.shops}</Typography>,
    },

    {
      id: 5,
      sortable: false,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 6,
      sortable: false,
      headerName: `PROFIT`,
      field: 'totalProfit',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <Typography variant="body4">
          {currency?.symbol}
          {(value || 0).toFixed(2)}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      {loading && <TableSkeleton columns={['avatar', 'avatar', 'text', 'text', 'text', 'text', 'text']} rows={7} />}
      {!loading && (
        <>
          <Box
            sx={{
              pr: 5,
              pl: 3.5,
              pt: 4,
              pb: 1,
            }}
          >
            <StyledTable
              columns={column}
              rows={
                data?.map((s, i) => {
                  s.rowNumber = i + 1;
                  return s;
                }) || []
              }
              getRowId={(row) => row?._id}
              rowHeight={71}
              components={{
                NoRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    No Shops found
                  </Stack>
                ),
              }}
            />
          </Box>
          {/* <TablePagination
            currentPage={queryParams?.page}
            lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
            totalPage={totalPage}
          /> */}
        </>
      )}
    </Box>
  );
}

export default SellersRankingTable;