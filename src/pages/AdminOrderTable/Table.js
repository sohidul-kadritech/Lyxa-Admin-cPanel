import { Box, Chip, Drawer, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as FlagIcon } from '../../assets/icons/order-flag.svg';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import OrderDetail from '../../components/Shared/OrderDetail';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import OrderCancel from '../NewOrder/OrderCancel';
import RefundOrder from '../NewOrder/RefundOrder';
import { UpdateFlag } from '../NewOrder/UpdateFlag';
import UpdateOrderStatusForm from '../NewOrder/UpdateOrderStatusForm';
import { getOrderProfit, getThreedotMenuOptions, orderStatusMap, statusColorVariants } from '../NewOrder/helpers';

const shopTypeLabelMap = { food: 'Restaurant', grocery: 'Grocery', pharmacy: 'Pharmacy' };

export default function Table({ orders = [], shopType, queryParams, setQueryParams, totalPage, orderType, loading }) {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const [detailOpen, setDetailOpen] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [flagModal, setFlagModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }

    if (menu === 'cancel_order') {
      setCurrentOrder(order);
      setOpenCancelModal(!openCancelModal);
    }

    if (menu === 'refund_order') {
      setCurrentOrder(order);
      setOpenRefundModal(!openRefundModal);
    }

    if (menu === 'update_status') {
      setUpdateStatusModal(true);
      setCurrentOrder(order);
    }
  };

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
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
              console.log('triggered');
              setCurrentOrder(row);
              setDetailOpen(true);
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
      showFor: ['ongoing', 'delivered', 'low-rating'],
      id: 2,
      headerName: `TYPE`,
      field: 'shopType',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: ({ row }) => <Typography variant="body4">{shopTypeLabelMap[row?.shop?.shopType]}</Typography>,
    },
    {
      showFor: ['ongoing', 'delivered', 'low-rating'],
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
              history.push({
                pathname: `/shop/profile/${row?.shop?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Order Table' },
              });
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered', 'low-rating'],
      id: 4,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      minWidth: 150,
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
      minWidth: 180,
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
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating'],
      id: 6,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating'],
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
      showFor: ['delivered', 'low-rating'],
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
      showFor: ['delivered', 'low-rating'],
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
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating'],
      id: 6,
      headerName: `ACTION`,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: (params) => (
        <ThreeDotsMenu
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
          menuItems={getThreedotMenuOptions(params?.row, 'admin')}
        />
      ),
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
      {/* update status */}
      <Modal
        open={updateStatusModal}
        onClose={() => {
          setUpdateStatusModal(false);
        }}
      >
        <UpdateOrderStatusForm
          onClose={() => setUpdateStatusModal(false)}
          setCurrentOrder={setCurrentOrder}
          currentOrder={currentOrder}
        />
      </Modal>
      {/* flag add */}
      <Modal
        open={flagModal}
        onClose={() => {
          setFlagModal(false);
        }}
      >
        <UpdateFlag currentOrder={currentOrder} onClose={() => setFlagModal(false)} />
      </Modal>
      {/*  cancel order */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <OrderCancel setOpenCancelModal={setOpenCancelModal} currentOrder={currentOrder} />
      </Modal>
      {/* rerfund order */}
      <Modal
        open={openRefundModal}
        onClose={() => {
          setOpenRefundModal(!openRefundModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <RefundOrder
          currentOrder={currentOrder}
          onClose={() => {
            setOpenRefundModal(false);
          }}
        />
      </Modal>
    </>
  );
}
