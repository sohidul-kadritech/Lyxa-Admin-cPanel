import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Rating from '../../components/Common/Rating';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { getShopStatusColor } from '../ShopProfile/Info';

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
          <Tooltip title={<span style={{ textTransform: 'capitalize' }}>{getShopStatusColor(row)?.status}</span>}>
            <Box
              sx={{
                width: '11px',
                height: '11px',
                backgroundColor: getShopStatusColor(row)?.color,
                borderRadius: '50%',
              }}
            />
          </Tooltip>
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
      id: 3,
      headerName: 'BRAND',
      field: 'shopBrand',
      flex: 1.5,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: 'ORDERS',
      field: 'totalOrder',
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      sortable: false,
      headerName: 'AVG.TIME',
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
            currentPage={Number(queryParams?.page)}
            lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
            totalPage={totalPage}
          />
        </>
      )}
    </Box>
  );
}
