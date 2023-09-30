/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Chip, Drawer, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import { ReactComponent as MessageIcon } from '../../assets/icons/message-icon.svg';
import { ReactComponent as FlagIcon } from '../../assets/icons/order-flag.svg';
import { ReactComponent as ReplacementIcon } from '../../assets/icons/replacement-order-icon.svg';
import LoadingOverlay from '../../components/Common/LoadingOverlay';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import UrgentOrderRecieved from '../../components/Layout/UrgentOrderReceivedNotification';
import CancelOrder from '../../components/Shared/CancelOrder';
import FlaggedModal from '../../components/Shared/Flagged';
import OrderDetail from '../../components/Shared/OrderDetail';
import RefundOrder from '../../components/Shared/RefundOrder';
import UpdateOrderStatus from '../../components/Shared/UpdateOrderStatus';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { UpdateFlag } from '../NewOrder/UpdateFlag';
import { getThreedotMenuOptions, orderStatusMap, statusColorVariants } from '../NewOrder/helpers';
import OrderTrackingModal from './OrderTracking';

const shopTypeLabelMap = { food: 'Restaurant', grocery: 'Grocery', pharmacy: 'Pharmacy' };

const filterColumns = (columns, shopType, orderType, showFor) => {
  let cols = columns.filter((col) => col?.showFor?.includes(orderType));

  if (shopType !== 'all') {
    cols = cols.filter((col) => col.headerName !== 'TYPE');
  }

  if (shopType === 'butler') {
    cols = cols.filter((col) => col.headerName !== 'SHOP' && col.headerName !== 'ORDER RATING');
  }

  if (showFor !== 'customerService') {
    cols = cols.filter((col) => col.headerName !== 'ACCEPTED');
  }

  return cols;
};

function CustomExpandRow({ row }) {
  return (
    <div>
      <p>{row.description}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default function Table({
  orders = [],
  shopType,
  queryParams,
  setQueryParams,
  totalPage,
  orderType,
  loading,
  refetching,
  render,
  setRender,
  showFor,
}) {
  const history = useHistory();

  const routeMatch = useRouteMatch();

  const { general, currentUser } = useGlobalContext();

  const currency = general?.currency?.symbol;

  const [detailOpen, setDetailOpen] = useState(false);

  const [updateStatusModal, setUpdateStatusModal] = useState(false);

  const [flagModal, setFlagModal] = useState(false);

  const [flagModalNew, setFlagModalNew] = useState(false);

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [openCancelModalNew, setOpenCancelModalNew] = useState(false);

  const [openRefundModal, setOpenRefundModal] = useState(false);

  const [newOrders, setNewOrders] = useState(orders);

  const [currentOrder, setCurrentOrder] = useState({});

  const [openUrgentOrder, setOpenUrgentOrder] = useState(false);

  const [openOrderTrackingModal, setOpenOrderTrackingModal] = useState(false);

  const [addedIndex, setAddedIndex] = useState(0);

  const location = useLocation();

  console.log('location', location?.state);

  useEffect(() => {
    setNewOrders([...orders]);
  }, [orders]);

  useEffect(() => {
    if (location?.search === '?urgent-order') {
      const findAcceptedCurrentOrder = orders.find(
        (order) => location?.state?.order?._id === order?._id && order?.isCustomerServiceAccepted,
      );
      console.log('===>', { findAcceptedCurrentOrder, location, render });
      if (findAcceptedCurrentOrder && Object?.keys(findAcceptedCurrentOrder)?.length && !render) {
        setCurrentOrder(findAcceptedCurrentOrder);
        setDetailOpen(true);
        setRender(true);
        if (!loading) {
          const searchParams = new URLSearchParams(location.search);
          searchParams.delete('urgent-order');
          history.replace({ search: searchParams.toString() });
        }
      } else {
        setCurrentOrder({});
        setDetailOpen(false);
        setRender(false);
      }
    }
    // remove the search params
  }, [loading, location?.search]);

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }

    if (menu === 'flag_test') {
      setFlagModalNew(true);
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

    if (menu === 'track_order') {
      setCurrentOrder(order);
      setOpenOrderTrackingModal(!openOrderTrackingModal);
    }

    if (menu === 'refund_order') {
      setCurrentOrder(order);
      setOpenRefundModal(!openRefundModal);
    }

    if (menu === 'update_status') {
      setUpdateStatusModal(true);
      setCurrentOrder(order);
    }

    if (menu === 'accept_urgent_order') {
      setOpenUrgentOrder(true);
      setCurrentOrder(order);
    }
  };

  const onClickExpandHandler = (data, element) => {
    const tempOrder = [...newOrders];

    const findOrderIndex = tempOrder?.findIndex((order) => order?._id === data?._id);

    if (findOrderIndex >= 0) {
      tempOrder?.splice(findOrderIndex + 1, 0, element);
      setAddedIndex(findOrderIndex + 1);
    } else {
      setAddedIndex(0);
    }

    setNewOrders((prev) => [...tempOrder]);
  };

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
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
          expandIcon={false}
          onClickExpand={() => {
            onClickExpandHandler(row, row?.originalOrder);
          }}
          name={
            <span>
              {row?.user?.name}
              {row?.chats?.length || row?.admin_chat_request?.length ? (
                <>
                  &nbsp;&nbsp;
                  <MessageIcon color="#5BBD4E" />
                </>
              ) : null}
              {row?.isReplacementOrder ? (
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
              setCurrentOrder(row);
              setDetailOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push({
                pathname: `/users/${row?.user?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
              });
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered', 'low-rating', 'scheduled'],
      id: 2,
      headerName: `TYPE`,
      field: 'shopType',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body4">{row?.isButler ? 'Butler' : shopTypeLabelMap[row?.shop?.shopType]}</Typography>
      ),
    },
    {
      showFor: ['ongoing'],
      id: 2,
      headerName: `ACCEPTED`,
      field: 'isCustomerServiceAccepted',
      sortable: false,
      minWidth: 120,
      flex: 1.5,
      renderCell: ({ value }) => (
        // <Typography variant="body4">{value === true ? 'Customer Service Accepted' : 'Not Accepted'}</Typography>
        <Chip
          label={value === true ? 'Accepted' : 'Not Accepted'}
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
      showFor: ['ongoing', 'delivered', 'low-rating', 'scheduled'],
      id: 3,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: ({ row }) => {
        if (row?.isButler) return '_';

        return (
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
                  state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
                });
              },
            }}
          />
        );
      },
    },
    {
      showFor: ['ongoing', 'delivered', 'low-rating', 'scheduled'],
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
      showFor: ['scheduled'],
      id: 5,
      headerName: 'SCHEDULED FOR',
      field: 'scheduleDate',
      sortable: false,
      flex: 1,
      minWidth: 220,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 6,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 7,
      headerName: `ORDER AMOUNT`,
      field: 'profit',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const total =
          // eslint-disable-next-line no-unsafe-optional-chaining
          row?.summary?.baseCurrency_cash + row?.summary?.baseCurrency_wallet + row?.summary?.baseCurrency_card;

        return (
          <Typography variant="body4">
            {currency} {(total || 0).toFixed(2)}
          </Typography>
        );
      },
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
      headerName: 'RIDER RATING',
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
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
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
          menuItems={getThreedotMenuOptions(params?.row, currentUser?.adminType)}
        />
      ),
    },
  ];

  const filteredColumns = useMemo(
    () => filterColumns(columns, shopType, orderType, showFor),
    [shopType, orderType, showFor],
  );

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
          position: 'relative',
        }}
      >
        {refetching && <LoadingOverlay sx={{ zIndex: '99' }} />}
        <StyledTable
          columns={filteredColumns}
          rows={newOrders}
          getRowId={(row) => row?._id}
          cus
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
        currentPage={Number(queryParams?.page)}
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

      <Modal sx={{ zIndex: '100 !important' }} open={flagModalNew}>
        <FlaggedModal
          onClose={() => {
            setFlagModalNew(false);
          }}
          order={currentOrder}
        />
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
      {/* update status */}
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

      {/*  cancel order */}
      <Modal
        open={openCancelModal}
        sx={{ zIndex: '10 !important' }}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
      >
        <Box>
          <CancelOrder order={currentOrder} onClose={() => setOpenCancelModal(false)} />
        </Box>
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
      {/* rerfund order */}
      <Modal
        open={openRefundModal}
        sx={{ zIndex: '10 !important' }}
        onClose={() => {
          setOpenRefundModal(!openRefundModal);
        }}
      >
        <Box>
          <RefundOrder
            order={currentOrder}
            onClose={() => {
              setOpenRefundModal(!openRefundModal);
            }}
          />
        </Box>
      </Modal>
      <Modal open={openOrderTrackingModal} centered>
        <Box>
          <OrderTrackingModal currentOrder={currentOrder} onClose={() => setOpenOrderTrackingModal(false)} />
        </Box>
      </Modal>

      <Modal open={openUrgentOrder}>
        <UrgentOrderRecieved
          order={currentOrder}
          onClose={() => {
            setOpenUrgentOrder(false);
          }}
        />
      </Modal>
    </>
  );
}
