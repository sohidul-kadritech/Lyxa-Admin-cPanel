import { Box, Stack, Typography } from '@mui/material';
import Rating from '../../components/Common/Rating';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';

// eslint-disable-next-line no-unused-vars
export default function ShopListTable({ shops, setPage, page, totalPage, loading }) {
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
      id: 2,
      headerName: <span style={{ display: 'inline-block', paddingLeft: '30px' }}>ITEM</span>,
      field: 'item',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" gap={5}>
          <Box
            sx={{
              width: '11px',
              height: '11px',
              backgroundColor: row?.liveStatus === 'online' ? 'success.main' : 'error.main',
              borderRadius: '50%',
            }}
          />
          <UserAvatar
            imgAlt="logo"
            imgUrl={row?.shopLogo}
            imgStyle="circular"
            imgFallbackCharacter={row?.shopName?.charAt(0)}
            name={row?.shopName}
          />
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: 'SELLER',
      field: 'seller',
      flex: 1.5,
      sortable: false,
      renderCell: ({ value }) => (
        <UserAvatar
          imgAlt="logo"
          imgUrl={value?.profile_photo}
          imgStyle="circular"
          imgFallbackCharacter={value?.company_name?.charAt(0)}
          name={value?.company_name}
        />
      ),
    },
    {
      id: 4,
      headerName: 'ORDERS',
      field: 'totalOrder',
      flex: 1,
      // sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: 'AVG.TIME',
      field: 'avgOrderDeliveryTime',
      flex: 1,
      // sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      // sortable: false,
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 6,
      headerName: 'PROFIT',
      field: 'totalProfit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
  ];

  return (
    <Box>
      <StyledBox
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
        }}
      >
        <StyledTable
          columns={column}
          rows={
            shops?.map((s, i) => {
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
      </StyledBox>
      <TablePagination currentPage={page} lisener={setPage} totalPage={totalPage} />
    </Box>
  );
}
