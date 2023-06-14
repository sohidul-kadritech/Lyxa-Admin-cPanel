import { Box, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as FlagIcon } from '../../assets/icons/order-flag.svg';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import OrderDetail from '../../components/Shared/OrderDetail';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';
import { getOrderProfit, orderStatusMap, statusColorVariants } from './helpers';

const shopTypeLabelMap = { food: 'Restaurant', grocery: 'Grocery', pharmacy: 'Pharmacy' };

export default function Table({ orders = [], shopType, queryParams, setQueryParams, totalPage, orderType, loading }) {
  const history = useHistory();

  const { general } = useGlobalContext();
  const currency = general?.currency?.code;

  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={row?.user?.profile_photo}
          imgFallbackCharacter={row?.user?.name?.charAt(0)}
          name={
            <span>
              {row?.user?.name}
              {row?.flag?.length ? (
                <>
                  &nbsp;&nbsp;
                  <FlagIcon color="#DD5B63" />
                </>
              ) : null}
            </span>
          }
          subTitle={row?.orderId}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              setOrder(row);
              setOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/accounts/${row?.user?._id}`);
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 2,
      headerName: `TYPE`,
      field: 'shopType',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => <Typography variant="body4">{shopTypeLabelMap[row?.shop?.shopType]}</Typography>,
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 3,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="shop-image"
          imgUrl={row?.shop?.shopLogo}
          imgFallbackCharacter={row?.shop?.shopName?.charAt(0)}
          name={row?.shop?.shopName}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/shop/profile/${row?.shop?._id}`);
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 4,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.paymentMethod} {row?.selectPos !== 'no' ? '(Pos)' : ''}
        </Typography>
      ),
    },
    {
      showFor: ['ongoing', 'cancelled'],
      id: 5,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1,
      minWidth: 140,
      renderCell: ({ value }) => (
        <Chip
          label={orderStatusMap[value || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[value] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 6,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 7,
      headerName: `ORDER AMOUNT`,
      field: 'profit',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency} {getOrderProfit(row, 'admin')}
        </Typography>
      ),
    },
    {
      showFor: ['delivered'],
      id: 8,
      headerName: 'ORDER RATING',
      field: 'shopRating',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'shop');
        if (rating) return <Rating amount={rating?.rating} />;
        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['delivered'],
      id: 8,
      headerName: 'Rider RATING',
      field: 'riderRating',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'deliveryBoy');
        if (rating) return <Rating amount={rating?.rating} />;
        return <Typography variant="body4">_</Typography>;
      },
    },
  ];

  if (shopType !== 'all') {
    columns.splice(1, 1);
  }

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
          columns={columns.filter((col) => col?.showFor?.includes(orderType))}
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
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
          setOrder({});
        }}
      >
        <OrderDetail
          order={order}
          onClose={() => {
            setOpen(false);
            setOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
