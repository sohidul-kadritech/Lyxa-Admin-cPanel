import { Box, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as FlagIcon } from '../../../assets/icons/order-flag.svg';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import OrderDetail from '../../../components/Shared/OrderDetail';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import { orderStatusMap, statusColorVariants } from '../../NewOrder/helpers';

const flagTypeMap = {
  user: 'User',
  delivery: 'Rider',
  shop: 'Shop',
  refused: 'Refused',
  auto: 'Auto Cancel',
  delay: 'Delay',
};

export default function Table({ orders = [], queryParams, setQueryParams, totalPage, loading }) {
  const history = useHistory();

  const [detailOpen, setDetailOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const columns = [
    {
      showFor: ['ongoing', 'delivered'],
      id: 2,
      headerName: `COMMENT`,
      field: 'comment',
      sortable: false,
      minWidth: 240,
      flex: 2,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orderId',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
      renderCell: ({ value }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={value?.user?.profile_photo}
          imgFallbackCharacter={value?.user?.name?.charAt(0) || 'C'}
          name={
            <span>
              {value?.user?.name}
              {value?.flag?.length ? (
                <>
                  &nbsp;&nbsp;
                  <FlagIcon color="#DD5B63" />
                </>
              ) : null}
            </span>
          }
          subTitle={value?.orderId}
          console={console.log(value)}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              setCurrentOrder(value);
              setDetailOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/accounts/${value?.user?._id}`);
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 2,
      headerName: `TYPE`,
      field: 'type',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{flagTypeMap[value]}</Typography>,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 6,
      headerName: 'CREATION DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'cancelled'],
      id: 5,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Chip
          label={orderStatusMap[row?.orderId?.orderStatus || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[row?.orderId?.orderStatus] || {}),
          }}
          variant="contained"
        />
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton columns={['avatar', 'avatar', 'text', 'text', 'text', 'text', 'text']} rows={7} />;
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
          rows={orders}
          getRowId={(row) => row?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Order found
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
      {/* order detail */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setCurrentOrder({});
        }}
      >
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setDetailOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
