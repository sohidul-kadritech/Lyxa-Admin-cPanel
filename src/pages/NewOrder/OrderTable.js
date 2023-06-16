// project import
import { Box, Chip, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';

import OrderCancel from './OrderCancel';
import PageSkeleton from './PageSkeleton';
import RefundOrder from './RefundOrder';
import { UpdateFlag } from './UpdateFlag';
import UpdateOrderStatusForm from './UpdateOrderStatusForm';
import { getOrderProfit, getThreedotMenuOptions, orderStatusMap, statusColorVariants } from './helpers';

export default function OrderTable({ orders = [], onRowClick, orderType, adminType, onViewDetail, loading }) {
  const { general } = useGlobalContext();

  const currency = general?.currency?.symbol;
  const history = useHistory();

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

  // eslint-disable-next-line no-unused-vars

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'shopProfile', 'riderProfile'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: orderType === 'cancelled ' ? 1.5 : 1,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={row?.user?.profile_photo}
          imgFallbackCharacter={row?.user?.name?.charAt(0)}
          name={row?.user?.name}
          subTitle={row?.orderId}
          subTitleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    if (onViewDetail) onViewDetail(row);
                  },
                }
              : undefined
          }
          titleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    history.push(`/accounts/${row?.user?._id}`);
                  },
                }
              : undefined
          }
        />
      ),
    },
    {
      showFor: ['riderProfile', 'userProfile'],
      id: 2,
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
          titleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    history.push(`/shop/profile/${row?.shop?._id}`);
                  },
                }
              : undefined
          }
        />
      ),
    },
    {
      showFor: ['ongoing', 'userProfile'],
      id: 2,
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
      showFor: ['ongoing', 'delivered', 'cancelled', 'shopProfile', 'userProfile', 'riderProfile'],
      id: 3,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: orderType === 'cancelled' ? 1.5 : 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['delivered', 'shopProfile'],
      id: 3,
      headerName: 'RIDER',
      field: 'deliveryBoy',
      minWidth: 240,
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="rider-image"
          imgUrl={row?.deliveryBoy?.image}
          imgFallbackCharacter={row?.deliveryBoy?.name?.charAt(0)}
          name={row?.deliveryBoy?.name}
          titleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    history.push(`/riders/${row?.deliveryBoy?._id}`);
                  },
                }
              : undefined
          }
        />
      ),
    },
    {
      showFor: ['riderProfile'],
      id: 4,
      headerName: 'RIDER RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const r = row?.reviews?.find((r) => r?.type === 'deliveryBoy');

        if (r) {
          return <Rating amount={r?.rating} />;
        }

        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['delivered', 'shopProfile'],
      id: 3,
      headerName: 'SHOP RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'shop');
        if (rating) return <Rating amount={rating?.rating} />;
        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['ongoing', 'cancelled', 'shopProfile', 'userProfile'],
      id: 4,
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
      showFor: ['ongoing', 'delivered', 'cancelled', 'shopProfile'],
      id: 5,
      headerName: `${adminType === 'admin' ? 'ORDER AMOUNT' : 'PROFIT'}`,
      field: 'profit',
      sortable: false,
      align: adminType === 'admin' ? 'center' : 'right',
      headerAlign: adminType === 'admin' ? 'center' : 'right',
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency} {getOrderProfit(row, adminType)}
        </Typography>
      ),
    },
    {
      showFor: ['riderProfile'],
      id: 5,
      headerName: 'NET PAYOUT',
      field: 'payout',
      sortable: false,
      flex: 0.5,
      minWidth: 140,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          fontWeight={600}
          display="flex"
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          {currency} {row?.deliveryBoyFee}
        </Typography>
      ),
    },
  ];

  const newColumn = {
    showFor: ['ongoing', 'delivered', 'cancelled', 'shopProfile', 'riderProfile', 'userProfile'],
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
        menuItems={getThreedotMenuOptions(params?.row, adminType)}
      />
    ),
  };

  if (adminType === 'admin') {
    columns.push(newColumn);
  }

  if (loading) {
    return <PageSkeleton orderType={orderType} />;
  }

  return (
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
        columns={columns.filter((column) => column.showFor.includes(orderType))}
        rows={orders}
        getRowId={(row) => row?._id}
        rowHeight={71}
        onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: onRowClick ? 'pointer' : 'default',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Order found
            </Stack>
          ),
        }}
      />

      {/* Update status */}
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
      {/* FLAG ADD */}
      <Modal
        open={flagModal}
        onClose={() => {
          setFlagModal(false);
        }}
      >
        <UpdateFlag currentOrder={currentOrder} onClose={() => setFlagModal(false)} />
      </Modal>
      {/* Cancel order */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <OrderCancel setOpenCancelModal={setOpenCancelModal} currentOrder={currentOrder} />
      </Modal>
      {/* Refund After Delivered */}
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
    </Box>
  );
}
