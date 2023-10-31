/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

function SalesRankingTable({ data = [], queryParams, setQueryParams, totalPage = 2, loading = false }) {
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
      flex: 7,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="logo"
          imgUrl={row?.profile_photo}
          imgStyle="circular"
          titleProps={{
            sx: { color: 'text.primary', cursor: 'default', textTransform: 'capitalize' },
            // onClick: () => {
            //   history?.push({
            //     pathname: `/shop/list/${row?._id}`,
            //     state: { from: routeMatch?.path, backToLabel: 'Back to Shop List' },
            //   });
            // },
          }}
          imgFallbackCharacter={row?.name?.charAt(0)}
          name={row?.name}
        />
      ),
    },
    {
      id: 4,
      sortable: false,
      headerName: '# SELLERS',
      field: 'totalSellers',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: '# SHOPS',
      field: 'totalShops',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
  ];

  return (
    <Box>
      {loading && <TableSkeleton columns={['text', 'avatar', 'text', 'text']} rows={3} />}
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
            currentPage={queryParams?.salesPage}
            lisener={(salesPage) => setQueryParams((prev) => ({ ...prev, salesPage }))}
            totalPage={queryParams?.totalPageSales}
          />
        </>
      )}
    </Box>
  );
}

export default SalesRankingTable;
