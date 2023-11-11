/* eslint-disable default-param-last */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unsafe-optional-chaining */
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
// import StyledTable from '../../components/Styled/StyledTable3';
import FormateBaseCurrency from '../../components/Common/FormateBaseCurrency';
import AdjustmentOrder from '../../components/Shared/AdjustMentOrder';
import ChangeDeliveryAddress from '../../components/Shared/ChangeDeliveryAddress';
import StyledTable5 from '../../components/Styled/StyledTable5';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { UpdateFlag } from '../NewOrder/UpdateFlag';
import { getThreedotMenuOptions, orderStatusMap, statusColorVariants } from '../NewOrder/helpers';
import OrderTrackingModal from './OrderTracking';

const shopTypeLabelMap = { food: 'Restaurant', grocery: 'Grocery', pharmacy: 'Pharmacy' };

const filterColumns = (columns, shopType, orderType = 'ongoing', showFor) => {
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

  // console.log('currentUser', currentUser);

  const currency = general?.currency?.symbol;

  const [detailOpen, setDetailOpen] = useState(false);

  const [updateStatusModal, setUpdateStatusModal] = useState(false);

  const [flagModal, setFlagModal] = useState(false);

  const [flagModalNew, setFlagModalNew] = useState(false);

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [openCancelModalNew, setOpenCancelModalNew] = useState(false);

  const [openRefundModal, setOpenRefundModal] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({});

  const [openUrgentOrder, setOpenUrgentOrder] = useState(false);

  const [openOrderTrackingModal, setOpenOrderTrackingModal] = useState(false);

  const [openAddressChange, setOpenAddressChange] = useState(false);

  const [openAdjustmentOrder, setOpenAdjustmentOrder] = useState(false);

  const [addedIndex, setAddedIndex] = useState(0);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (location?.pathname === '/ongoing-tickets') {
      if (searchParams.get('currentTab') === '3') {
        const findAcceptedCurrentOrder = orders?.find((item) => item?._id === location?.state?.order?._id);
        if (findAcceptedCurrentOrder) {
          setCurrentOrder(findAcceptedCurrentOrder);
          setDetailOpen(true);
          history.push({
            pathname: location?.pathname,
            search: location?.search,
          });
        }
      }
    }
  }, [loading, location?.search, orders, location?.state?.order?._id]);

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'change_address') {
      setOpenAddressChange(true);
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

    if (menu === 'adjust_order') {
      setOpenAdjustmentOrder(true);
      setCurrentOrder(order);
    }
  };

  const columnsForExpand = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
      renderCell: ({ row, onExpandHandler }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={row?.user?.profile_photo}
          imgFallbackCharacter={row?.user?.name?.charAt(0)}
          expandIcon={false}
          // onClickExpand={() => {}}
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
      id: 3,
      headerName: `ACCEPTED`,
      field: 'isCustomerServiceAccepted',
      sortable: false,
      minWidth: 120,
      flex: 1.5,
      renderCell: ({ value }) => (
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
            maxWidth: '150px',
            ...(statusColorVariants[value] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['scheduled'],
      id: 7,
      headerName: 'SCHEDULED FOR',
      field: 'scheduleDate',
      sortable: false,
      flex: 1,
      minWidth: 220,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 8,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 9,
      headerName: `ORDER AMOUNT`,
      field: 'profit',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const total =
          row?.summary?.baseCurrency_cash + row?.summary?.baseCurrency_wallet + row?.summary?.baseCurrency_card;

        const totalOringinalOrder = row?.summary?.baseCurrency_totalAmount + row?.summary?.baseCurrency_vat;

        return <Typography variant="body4">{FormateBaseCurrency.get(totalOringinalOrder || 0)}</Typography>;
      },
    },
    {
      showFor: ['delivered', 'low-rating'],
      id: 10,
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
      id: 11,
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
      id: 12,
      headerName: `ACTION`,
      field: 'action',
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: (params) => <></>,
    },
  ];

  const filteredColumnsForExpand = useMemo(
    () => filterColumns(columnsForExpand, shopType, orderType, showFor),
    [shopType, orderType, showFor],
  );

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled', 'low-rating', 'scheduled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'orders',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
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
                columns={filteredColumnsForExpand}
                rows={[{ ...row }]}
              />,
            );
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
              setCurrentOrder(row?.isReplacementOrder && row?.orderStatus === 'delivered' ? row?.originalOrder : row);
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
            // maxWidth: '150px',
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
          row?.summary?.baseCurrency_cash + row?.summary?.baseCurrency_wallet + row?.summary?.baseCurrency_card;

        const totalOringinalOrder =
          row?.originalOrder?.summary?.baseCurrency_cash +
          row?.originalOrder?.summary?.baseCurrency_wallet +
          row?.originalOrder?.summary?.baseCurrency_card;

        const finalTotal =
          row?.isReplacementOrder && row?.orderStatus === 'delivered'
            ? totalOringinalOrder
            : row?.isReplacementOrder
            ? row?.summary?.baseCurrency_totalAmount + row?.summary?.baseCurrency_vat
            : total;

        return <Typography variant="body4">{FormateBaseCurrency.get(finalTotal || 0)}</Typography>;
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
              currentUser?.adminType === 'admin' ||
                (currentUser?.adminType === 'customerService' && showFor === 'admin')
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

        <StyledTable5
          columns={filteredColumns}
          rows={orders}
          NoRowsOverlay={
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Order found
            </Stack>
          }
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
          // setCurrentOrder({});
        }}
      >
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setDetailOpen(false);
            // setCurrentOrder({});
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
        <Box>
          <UrgentOrderRecieved
            order={currentOrder}
            onClose={() => {
              setOpenUrgentOrder(false);
            }}
          />
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
    </>
  );
}
