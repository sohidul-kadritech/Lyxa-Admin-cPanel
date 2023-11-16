/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// project import
import { Box, Chip, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as ReplacementIcon } from '../../assets/icons/replacement-order-icon.svg';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import UserAvatar from '../../components/Common/UserAvatar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';

import { ReactComponent as MessageIcon } from '../../assets/icons/message-icon.svg';
import { ReactComponent as FlagIcon } from '../../assets/icons/order-flag.svg';
import AdjustmentOrder from '../../components/Shared/AdjustMentOrder';
import ChangeDeliveryAddress from '../../components/Shared/ChangeDeliveryAddress';
import FlaggedModal from '../../components/Shared/Flagged';
import UpdateOrderStatus from '../../components/Shared/UpdateOrderStatus';
import StyledTable5 from '../../components/Styled/StyledTable5';
import OrderTrackingModal from '../AdminOrderTable/OrderTracking';
import { getOrderStatus } from '../AdminOrderTable/Table';
import OrderCancel from './OrderCancel';
import PageSkeleton from './PageSkeleton';
import RefundOrder from './RefundOrder';
import { UpdateFlag } from './UpdateFlag';
import { getOrderProfit, getThreedotMenuOptions, statusColorVariants } from './helpers';

export default function OrderTable({ orders = [], onRowClick, orderType, adminType, showFor, onViewDetail, loading }) {
  const { general, currentUser } = useGlobalContext();
  const { userType } = currentUser;

  const currency = general?.currency?.symbol;
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const [updateStatusModal, setUpdateStatusModal] = useState(false);

  const [openOrderTrackingModal, setOpenOrderTrackingModal] = useState(false);

  const [openUrgentOrder, setOpenUrgentOrder] = useState(false);

  const [flagModalNew, setFlagModalNew] = useState(false);

  const [openAdjustmentOrder, setOpenAdjustmentOrder] = useState(false);

  const [flagModal, setFlagModal] = useState(false);

  const [openAddressChange, setOpenAddressChange] = useState(false);

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [openCancelModalNew, setOpenCancelModalNew] = useState(false);

  const [openRefundModal, setOpenRefundModal] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({});

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'change_address') {
      setOpenAddressChange(true);
      setCurrentOrder(order);
    }
    if (menu === 'cancel_order') {
      setCurrentOrder(order);
      setOpenCancelModal(!openCancelModal);
    }
    if (menu === 'cancel_order_test') {
      setCurrentOrder(order);
      setOpenCancelModalNew(true);
    }
    if (menu === 'refund_order') {
      setCurrentOrder(order);

      setOpenRefundModal(!openRefundModal);
    }
    if (menu === 'update_status') {
      setUpdateStatusModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'track_order') {
      setOpenOrderTrackingModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'accept_urgent_order') {
      setOpenUrgentOrder(true);
      setCurrentOrder(order);
    }

    if (menu === 'flag_test') {
      setFlagModalNew(true);
      setCurrentOrder(order);
    }

    if (menu === 'adjust_order') {
      setOpenAdjustmentOrder(true);
      setCurrentOrder(order);
    }
  };

  const columnsForExpand = [
    {
      showFor: ['ongoing', 'requested', 'delivered', 'cancelled', 'shopProfile', 'riderProfile', 'scheduled'],
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
          name={
            <span>
              {row?.user?.name}
              {(row?.chats?.length || row?.admin_chat_request?.length) && userType === 'admin' ? (
                <>
                  &nbsp;&nbsp;
                  <MessageIcon color="#5BBD4E" />
                </>
              ) : null}
              {row?.isReplacementOrder && row?.orderStatus !== 'delivered' ? (
                <>
                  &nbsp;&nbsp;
                  <ReplacementIcon style={{ height: 18 }} color="#DD5B63" />
                </>
              ) : null}
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
              if (onViewDetail) onViewDetail(row);
            },
          }}
          titleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    history.push({
                      pathname: `/users/${row?.user?._id}`,
                      state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
                    });
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
                    history.push({
                      pathname: `/shop/profile/${row?.shop?._id}`,
                      state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
                    });
                  },
                }
              : undefined
          }
        />
      ),
    },
    {
      showFor: ['ongoing', 'requested', 'userProfile', 'scheduled'],
      id: 2,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.paymentMethod} {row?.selectPos !== 'no' ? '(Pos)' : ''}
        </Typography>
      ),
    },
    {
      showFor: [
        'ongoing',
        'requested',
        'delivered',
        'cancelled',
        'shopProfile',
        'userProfile',
        'riderProfile',
        'scheduled',
      ],
      id: 3,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      minWidth: 150,
      flex: orderType === 'cancelled' ? 1.5 : 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['scheduled'],
      id: 3,
      headerName: 'SCHEDULED FOR',
      field: 'scheduleDate',
      sortable: false,
      flex: 1,
      minWidth: 150,
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
      renderCell: ({ row }) => {
        if (!row?.deliveryBoy) {
          return '_';
        }

        return (
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
        );
      },
    },
    {
      showFor: ['riderProfile'],
      id: 4,
      headerName: 'RIDER RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'shop');
        if (rating) return <Rating amount={rating?.rating} />;
        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['ongoing', 'requested', 'cancelled', 'shopProfile', 'userProfile'],
      id: 4,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Chip
          // label={orderStatusMap[value] || ''}
          label={getOrderStatus(row)}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            maxWidth: '200px',
            ...(statusColorVariants[row?.orderStatus] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['ongoing', 'requested', 'delivered', 'cancelled', 'shopProfile'],
      id: 5,
      headerName: `${adminType === 'admin' ? 'ORDER AMOUNT' : 'PAYOUTS'}`,
      field: 'payouts',
      sortable: false,
      align: adminType === 'admin' ? 'center' : 'right',
      headerAlign: adminType === 'admin' ? 'center' : 'right',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency} {(getOrderProfit(row, adminType) || 0)?.toFixed(2)}
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
          {currency} {row?.baseCurrency_riderFee?.toFixed(2)}
        </Typography>
      ),
    },
  ];

  const columns = [
    {
      showFor: ['ongoing', 'requested', 'delivered', 'cancelled', 'shopProfile', 'riderProfile', 'scheduled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: orderType === 'cancelled ' ? 1.5 : 1,
      sortable: false,
      renderCell: ({ row, onExpandHandler }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={row?.user?.profile_photo}
          imgFallbackCharacter={row?.user?.name?.charAt(0)}
          expandIcon={row?.orderStatus === 'delivered' && row?.isReplacementOrder}
          onClickExpand={() => {
            onExpandHandler(
              <StyledTable5
                showHeader={false}
                rowSx={{ border: 'none' }}
                rowInnerContainerSx={{ padding: '0px' }}
                columns={columnsForExpand?.filter((column) => column.showFor.includes(orderType))}
                rows={[{ ...row }]}
              />,
            );
          }}
          name={
            <span>
              {row?.user?.name}
              {(row?.chats?.length || row?.admin_chat_request?.length) && userType === 'admin' ? (
                <>
                  &nbsp;&nbsp;
                  <MessageIcon color="#5BBD4E" />
                </>
              ) : null}
              {row?.isReplacementOrder && row?.orderStatus !== 'delivered' ? (
                <>
                  &nbsp;&nbsp;
                  <ReplacementIcon style={{ height: 18 }} color="#DD5B63" />
                </>
              ) : null}
              {row?.flag?.length ? (
                <>
                  &nbsp;&nbsp;
                  <FlagIcon color="#DD5B63" />
                </>
              ) : null}
            </span>
          }
          subTitle={
            row?.isReplacementOrder && row?.orderStatus === 'delivered' ? row?.originalOrder?.orderId : row?.orderId
          }
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              if (onViewDetail)
                onViewDetail(row?.isReplacementOrder && row?.orderStatus === 'delivered' ? row?.originalOrder : row);
            },
          }}
          titleProps={
            adminType === 'admin'
              ? {
                  sx: { color: 'primary.main', cursor: 'pointer' },
                  onClick: () => {
                    history.push({
                      pathname: `/users/${row?.user?._id}`,
                      state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
                    });
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
                    history.push({
                      pathname: `/shop/profile/${row?.shop?._id}`,
                      state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
                    });
                  },
                }
              : undefined
          }
        />
      ),
    },
    {
      showFor: ['ongoing', 'requested', 'userProfile', 'scheduled'],
      id: 2,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.paymentMethod} {row?.selectPos !== 'no' ? '(Pos)' : ''}
        </Typography>
      ),
    },
    {
      showFor: [
        'ongoing',
        'requested',
        'delivered',
        'cancelled',
        'shopProfile',
        'userProfile',
        'riderProfile',
        'scheduled',
      ],
      id: 3,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      minWidth: 150,
      flex: orderType === 'cancelled' ? 1.5 : 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['scheduled'],
      id: 3,
      headerName: 'SCHEDULED FOR',
      field: 'scheduleDate',
      sortable: false,
      flex: 1,
      minWidth: 150,
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
      renderCell: ({ row }) => {
        if (!row?.deliveryBoy) {
          return '_';
        }

        return (
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
        );
      },
    },
    {
      showFor: ['riderProfile'],
      id: 4,
      headerName: 'RIDER RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'shop');
        if (rating) return <Rating amount={rating?.rating} />;
        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['ongoing', 'requested', 'cancelled', 'shopProfile', 'userProfile'],
      id: 4,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Chip
          // label={orderStatusMap[value] || ''}
          label={getOrderStatus(row)}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            maxWidth: '200px',
            ...(statusColorVariants[row?.orderStatus] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['ongoing', 'requested', 'delivered', 'cancelled', 'shopProfile'],
      id: 5,
      headerName: `${adminType === 'admin' ? 'ORDER AMOUNT' : 'PAYOUTS'}`,
      field: 'payouts',
      sortable: false,
      align: adminType === 'admin' ? 'center' : 'right',
      headerAlign: adminType === 'admin' ? 'center' : 'right',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {(
            getOrderProfit(
              row?.isReplacementOrder && row?.orderStatus === 'delivered' ? row?.originalOrder : row,
              adminType,
            ) || 0
          )?.toFixed(2)}
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
          {currency} {row?.baseCurrency_riderFee?.toFixed(2)}
        </Typography>
      ),
    },
  ];

  /*
  This column is only for admin console
  */

  const newColumn = {
    showFor: ['ongoing', 'requested', 'delivered', 'cancelled', 'shopProfile', 'riderProfile', 'userProfile'],
    id: 6,
    headerName: `ACTION`,
    sortable: false,
    align: 'right',
    headerAlign: 'right',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <ThreeDotsMenu
        handleMenuClick={(menu) => {
          threeDotHandler(
            menu,
            params?.row?.isReplacementOrder && params?.row?.orderStatus === 'delivered'
              ? params?.row?.originalOrder
              : params?.row,
          );
        }}
        disabled={
          !getThreedotMenuOptions(
            params?.row?.isReplacementOrder && params?.row?.orderStatus === 'delivered'
              ? params?.row?.originalOrder
              : params?.row,
            currentUser?.adminType === 'admin' || (currentUser?.adminType === 'customerService' && showFor === 'admin')
              ? 'admin'
              : currentUser?.adminType,
          ).length
        }
        menuItems={getThreedotMenuOptions(
          params?.row?.isReplacementOrder && params?.row?.orderStatus === 'delivered'
            ? params?.row?.originalOrder
            : params?.row,
          currentUser?.adminType === 'admin' || (currentUser?.adminType === 'customerService' && showFor === 'admin')
            ? 'admin'
            : currentUser?.adminType,
        )}
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
      <StyledTable5
        columns={columns.filter((column) => column.showFor.includes(orderType))}
        rows={orders}
        onRowClick={onRowClick}
        NoRowsOverlay={
          <Stack height="100%" alignItems="center" justifyContent="center">
            No Order found
          </Stack>
        }
      />

      {/* Update status */}
      <Modal
        open={updateStatusModal}
        onClose={() => {
          setUpdateStatusModal(false);
        }}
      >
        <Box>
          <UpdateOrderStatus
            onClose={() => setUpdateStatusModal(false)}
            setCurrentOrder={setCurrentOrder}
            currentOrder={currentOrder}
          />
        </Box>
      </Modal>

      {/* flag add */}
      <Modal
        open={flagModal}
        onClose={() => {
          setFlagModal(false);
        }}
      >
        <Box>
          <UpdateFlag currentOrder={currentOrder} onClose={() => setFlagModal(false)} />
        </Box>
      </Modal>

      {/* Cancel order */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <Box>
          <OrderCancel setOpenCancelModal={setOpenCancelModal} currentOrder={currentOrder} />
        </Box>
      </Modal>

      {/* Refund After Delivered */}
      <Modal
        open={openRefundModal}
        onClose={() => {
          setOpenRefundModal(!openRefundModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <Box>
          <RefundOrder
            currentOrder={currentOrder}
            onClose={() => {
              setOpenRefundModal(false);
            }}
          />
        </Box>
      </Modal>

      <Modal open={openOrderTrackingModal} centered>
        <Box>
          <OrderTrackingModal currentOrder={currentOrder} onClose={() => setOpenOrderTrackingModal(false)} />
        </Box>
      </Modal>

      <Modal open={openAddressChange}>
        <ChangeDeliveryAddress
          order={currentOrder}
          onClose={() => {
            setOpenAddressChange(false);
          }}
        />
      </Modal>

      {/* adjustment order */}

      <Modal
        open={openAdjustmentOrder}
        onClose={() => {
          setOpenAdjustmentOrder(false);
        }}
      >
        <AdjustmentOrder
          order={currentOrder}
          onClose={() => {
            setOpenAdjustmentOrder(false);
            setCurrentOrder({});
          }}
        />
      </Modal>

      <Modal sx={{ zIndex: '100 !important' }} open={flagModalNew}>
        <FlaggedModal
          onClose={() => {
            setFlagModalNew(false);
          }}
          order={currentOrder}
        />
      </Modal>

      {/*  cancel order with flag modal */}
      <Modal
        open={openCancelModalNew}
        sx={{ zIndex: '100 !important' }}
        onClose={() => {
          setOpenCancelModalNew(false);
        }}
      >
        <FlaggedModal
          onClose={() => {
            setOpenCancelModalNew(false);
          }}
          order={currentOrder}
          showFor="cancel-order"
        />
      </Modal>
    </Box>
  );
}
