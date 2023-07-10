/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Rating from '../../../components/Common/Rating';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function ShopRankingTable({ data = [], queryParams, setQueryParams, loading = false }) {
  const history = useHistory();
  console.log('data=>', data);
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
      headerName: 'Name',
      field: 'shopName',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="logo"
          imgUrl={row?.shopLogo}
          imgStyle="circular"
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history?.push({
                pathname: `/shop/profile/${row?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Shop List' },
              });
            },
          }}
          imgFallbackCharacter={row?.shopName?.charAt(0)}
          name={row?.shopName}
        />
      ),
    },
    {
      id: 4,
      sortable: false,
      headerName: 'SELLER',
      // renderHeader: () => (
      //   <CommonHeader title="ORDERS" filter="sortByOrders" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'sellerName',
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: 'ITEM SOLD',
      // renderHeader: () => (
      //   <CommonHeader title="AVG.TIME" filter="sortByAvgTime" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'itemsSold',
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
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
      field: 'profit',
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
      {loading && <TableSkeleton columns={['avatar', 'text', 'text', 'text', 'text']} rows={7} />}
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
          <TablePagination
            currentPage={queryParams?.page}
            lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
            totalPage={queryParams?.totalPage}
          />
        </>
      )}
    </Box>
  );
}

export default ShopRankingTable;
