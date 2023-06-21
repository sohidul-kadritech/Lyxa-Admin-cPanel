// project import
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import OrderDetail from '../../../components/Shared/OrderDetail';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function ShopRatingTable({ rows = [], type, queryParams, setQueryParams, totalPage, user, loading }) {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const columns = [
    {
      id: 1,
      headerName: 'REVIEW',
      field: 'reivew',
      flex: 2,
      sortable: false,
      renderCell: ({ row }) => {
        const t2 = row?.reviewTags?.join(', ');
        const t1 = `${row?.reviewDes}${t2 && row?.reviewDes ? ',' : ''} ${t2}`;
        return (
          <Typography className="text-dots" variant="body4" pr={7.5}>
            {t1 || '_'}
          </Typography>
        );
      },
    },
    {
      id: 2,
      headerName: type === 'shop' ? 'SHOP' : 'RIDER',
      field: 'shop',
      flex: 1,
      sortable: false,
      minWidth: 250,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="shop-image"
          imgUrl={row?.order?.shop?.shopLogo}
          imgFallbackCharacter={row?.order?.shop?.shopName?.charAt(0)}
          name={row?.order?.shop?.shopName}
          subTitle={row?.order?.orderId}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              row.order.user = user;
              setCurrentOrder(row?.order);
              setSidebarOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push({
                pathname: `/shop/profile/${row?.order?.shop?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to User Profile' },
              });
            },
          }}
        />
      ),
    },
    {
      id: 3,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 4,
      headerName: 'DATE',
      field: 'createdAt',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
  ];

  if (loading) {
    return <TableSkeleton columns={['text', 'avatar', 'text', 'text']} rows={5} />;
  }

  return (
    <>
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
        }}
      >
        <StyledTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Ratings Find
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
      <Drawer open={sidebarOpen} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setSidebarOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
