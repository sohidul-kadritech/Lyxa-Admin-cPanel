import { Box, Stack, Typography } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Rating from '../../../components/Common/Rating';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../../context';
import { getShopStatusColor } from '../../ShopProfile/Info';

// const IconButton = styled('span')(() => ({
//   width: '30px',
//   height: '30px',
//   display: 'inline-flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: 'rgba(54, 54, 54, 0.5)',
//   borderRadius: '50%',

//   '& .MuiSvgIcon-root': {
//     width: '16px',
//     height: '16px',
//   },

//   '&:hover': {
//     background: 'rgba(0, 0, 0, 0.05)',
//   },
// }));

/*
  sortByOrders: '',
  sortByAvgTime: '',
  sortByRating: '',
  sortByProfit: '',
*/

// function CommonHeader({ title, filter, queryParams, refetch }) {
//   const props = ['sortByOrders', 'sortByAvgTime', 'sortByRating', 'sortByProfit'];
//   const [render, setRender] = useState(false);

//   const onClick = () => {
//     let val = '';
//     if (queryParams[filter] === 'asc') val = 'desc';
//     if (queryParams[filter] === 'desc') val = '';
//     if (queryParams[filter] === '') val = 'asc';

//     props.forEach((p) => {
//       queryParams[p] = '';
//     });

//     queryParams[filter] = val;

//     setRender(!render);
//     refetch();
//   };

//   return (
//     <Stack direction="row" alignItems="center" gap="2px" sx={{ cursor: 'pointer' }} onClick={onClick}>
//       <span>{title}</span>
//       {queryParams[filter] !== '' && (
//         <IconButton>{queryParams[filter] === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}</IconButton>
//       )}
//     </Stack>
//   );
// }

export default function ShopListTable({
  shops,
  totalPage,
  loading,
  handleMenuClick,
  menuItems,
  queryParams,
  setQueryParams,
}) {
  const history = useHistory();
  const { dispatchCurrentUser, general } = useGlobalContext();

  const { currency } = general;
  console.log(currency);
  const routeMatch = useRouteMatch();
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
      headerName: <span style={{ display: 'inline-block', paddingLeft: '30px' }}>SHOP NAME</span>,
      field: 'item',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" gap={5}>
          <Box
            sx={{
              width: '11px',
              height: '11px',
              backgroundColor: getShopStatusColor(row),
              borderRadius: '50%',
            }}
          />
          <UserAvatar
            imgAlt="logo"
            imgUrl={row?.shopLogo}
            imgStyle="circular"
            imgFallbackCharacter={row?.shopName?.charAt(0)}
            name={row?.shopName}
            titleProps={{
              sx: { color: 'primary.main', cursor: 'pointer' },
              onClick: () => {
                history?.push({
                  pathname: `/shop/profile/${row?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Shop List' },
                });
                dispatchCurrentUser({ type: 'shop', payload: { shop: row } });
              },
            }}
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
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history?.push({
                pathname: `/seller/list/${value?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Shop List' },
              });
            },
          }}
          imgFallbackCharacter={value?.company_name?.charAt(0)}
          name={value?.company_name}
        />
      ),
    },
    {
      id: 4,
      sortable: false,
      headerName: 'ORDERS',
      // renderHeader: () => (
      //   <CommonHeader title="ORDERS" filter="sortByOrders" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'totalOrder',
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: 'AVG.TIME',
      // renderHeader: () => (
      //   <CommonHeader title="AVG.TIME" filter="sortByAvgTime" queryParams={queryParams} refetch={refetch} />
      // ),
      field: 'avgOrderDeliveryTime',
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
    {
      id: 7,
      headerName: '',
      field: 'action',
      flex: 0.9,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: (params) => (
        <ThreeDotsMenu
          handleMenuClick={(menu) => {
            handleMenuClick(menu, params.row);
          }}
          menuItems={menuItems}
        />
      ),
    },
  ];

  return (
    <Box>
      {loading && <TableSkeleton columns={['avatar', 'avatar', 'text', 'text', 'text', 'text', 'text']} rows={7} />}
      {!loading && (
        <>
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
          <TablePagination
            currentPage={queryParams?.page}
            lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
            totalPage={totalPage}
          />
        </>
      )}
    </Box>
  );
}
