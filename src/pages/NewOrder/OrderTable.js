// project import
import { Box, Chip, Modal, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderCancel from './OrderCancel';
import PageSkeleton from './PageSkeleton';
import RefundOrder from './RefundOrder';
import UpdateFlag from './UpdateFlag';
import UpdateOrderStatusForm from './UpdateOrderStatusForm';
import {
  butlerFlagTypeOptions,
  getOrderProfit,
  getThreedotMenuOptions,
  orderCancelDataFormation,
  orderFlagTypeOptions,
  orderStatusMap,
  statusColorVariants,
} from './helpers';

const cancelOrderInit = {
  cancelReasonId: '',
  orderId: null,
  otherReason: '',
  refundType: 'none',
  deliveryBoy: {},
  partialPayment: {
    deliveryBoy: '',
    admin: '',
  },
};

export default function OrderTable({ orders = [], onRowClick, orderType, adminType, loading }) {
  const { general } = useGlobalContext();
  const { socket } = useSelector((state) => state.socketReducer);
  const currency = general?.currency?.code;
  const history = useHistory();

  const [appVat, setAppVat] = useState(0);

  const [deliverySearchKey, setDeliverySearchKey] = useState(null);

  const [updateStatusModal, setUpdateStatusModal] = useState(false);

  const [isOtherReason, setIsOtherReason] = useState(false);

  const [flagModal, setFlagModal] = useState(false);

  const [flagType, setFlagType] = useState([]);

  const [flagComment, setFlagComment] = useState('');

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [openRefundModal, setOpenRefundModal] = useState(false);

  const [newRefundType, setNewRefundType] = useState('');

  const [newOrderStatus, setNewOrderStatus] = useState('');

  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');

  const [currentOrderShop, setCurrentOrderShop] = useState({});

  const [currentOrder, setCurrentOrder] = useState({});

  const [currentOrderDelivery, setCurrentOrderDelivery] = useState({});

  const [orderCancel, setOrderCancel] = useState(cancelOrderInit);

  const [orderPayment, setOrderPayment] = useState({
    deliveryBoy: 0,
    admin: 0,
  });

  const threeDotHandler = (menu, order) => {
    if (menu === 'flag') {
      setNewRefundType('');
      setFlagModal(true);
      setCurrentOrder(order);
    }
    if (menu === 'cancel_order') {
      setNewRefundType('');
      setCurrentOrder(order);
      setOpenCancelModal(!openCancelModal);

      if (order?.isButler) {
        setOrderPayment({
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge,
        });
        console.log('order', order);
        setOrderCancel(orderCancelDataFormation('cancel_order', order, orderCancel));
      } else {
        setOrderPayment({
          shop: order?.sellerEarnings,
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge?.totalDropAmount,
        });

        setOrderCancel(orderCancelDataFormation('cancel_order', order, orderCancel));
      }
    }
    if (menu === 'refund_order') {
      setCurrentOrder(order);
      setNewRefundType('delivered');
      setOpenRefundModal(!openRefundModal);
      if (order?.isButler) {
        setOrderPayment({
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge,
        });
        setOrderCancel(orderCancelDataFormation('refund_order', order, orderCancel));
      } else {
        setOrderPayment({
          shop: order?.sellerEarnings,
          deliveryBoy: order?.deliveryBoyFee,
          admin: order?.dropCharge?.totalDropAmount,
        });
        console.log('order?.deliveryBoyFee', order?.deliveryBoyFee);
        setOrderCancel(orderCancelDataFormation('refund_order', order, orderCancel));
      }
    }
    if (menu === 'update_status') {
      setNewRefundType('');
      setUpdateStatusModal(true);
      setCurrentOrder(order);
      setCurrentOrderShop(order?.shop);
      setCurrentOrderDelivery(order?.deliveryBoy || {});
    }
  };

  // eslint-disable-next-line no-unused-vars
  const resetFlagModal = () => {
    setFlagModal(false);
    setFlagType([]);
    setFlagComment('');
  };

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
                    if (onRowClick) {
                      onRowClick(row);
                    }
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

  const queryClient = useQueryClient();

  // Update Status
  const resetUpdateStatusModal = () => {
    setUpdateStatusModal(false);
    setNewOrderStatus('');
    setCurrentButlerSearchKey('');
    setCurrentOrderDelivery({});
    setCurrentOrder({});
    setCurrentOrderShop({});
  };

  // eslint-disable-next-line no-unused-vars
  const cancelOrderForButlarMutation = useMutation((data) => AXIOS.post(Api.BUTLER_CANCEL_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpenCancelModal(false);
        queryClient.invalidateQueries(Api.ORDER_LIST);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const cancelOrderByAdminMutation = useMutation((data) => AXIOS.post(Api.CANCEL_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpenCancelModal(false);
        queryClient.invalidateQueries(Api.ORDER_LIST);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const getFlagOptions = (currentOrder) => {
    const options = currentOrder?.isButler ? butlerFlagTypeOptions : orderFlagTypeOptions;
    const newOptions = [];
    let isAllFlagged = true;

    options.forEach((item) => {
      if (!currentOrder?.deliveryBoy?._id && item.value === 'delivery') {
        return;
      }
      if (currentOrder?.flag?.find((flagItem) => flagItem[item.value])) {
        newOptions.push({
          ...item,
          isDisabled: true,
        });
      } else {
        isAllFlagged = false;
        newOptions.push({
          ...item,
        });
      }
    });

    return {
      options: newOptions,
      isAllFlagged,
    };
  };

  const handleFlagTypeChange = (value) => {
    if (flagType.includes(value)) {
      setFlagType((prev) => prev.filter((val) => val !== value));
    } else {
      setFlagType((prev) => [...prev, value]);
    }
  };

  const flagOptions = useMemo(() => getFlagOptions(currentOrder), [currentOrder]);

  const getCancelReasonsQuery = useQuery([Api.ALL_ORDER_CANCEL_REASON], () => AXIOS.get(Api.ALL_ORDER_CANCEL_REASON));

  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data, config) => {
        console.log(data, config);
        if (data.status) {
          successMsg(data?.message, 'success');
          queryClient.invalidateQueries(['all-orders']);
          resetUpdateStatusModal();
          // emit socket
          if (config.service === 'regular') {
            if (config?.data?.orderStatus === 'accepted_delivery_boy')
              socket.emit('adminAcceptedOrder', { orderId: config.data?.orderId });
            else
              socket.emit('updateOrder', {
                orderId: config.data?.orderId,
              });
          }
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // eslint-disable-next-line no-unused-vars
  const getAppSettingsData = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('app setttings; ', data?.data?.appSetting);
        setAppVat(data?.data?.appSetting?.vat);
      }
    },
  });

  const refundOrderMutation = useMutation((data) => AXIOS.post(Api.REFUND_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(Api.ORDER_LIST);
        setOpenRefundModal(false);
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  const nearByDeliveryBoysQuery = useQuery(
    ['single-order-nearby-delivery-boys', { orderId: currentOrder?._id || '' }],
    getNearByDeliveryBoys,
    {
      enabled: newOrderStatus === 'accepted_delivery_boy',
      cacheTime: 0,
      staleTime: 0,
      onSuccess: (data) => {
        if (!data?.status) {
          successMsg(data?.message || 'Could not get delivery boys');
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
        successMsg(error?.message || 'Could not get delivery boys', 'error');
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const addFlagMutation = useMutation(
    (payload) => {
      console.log('payload data', payload.data);
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_ADD_FLAG : Api.SEND_ORDER_FLAG;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          queryClient.invalidateQueries(['all-orders']);
          successMsg(data?.message, 'success');
          resetFlagModal();
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        successMsg(error?.message);
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const updateRefundType = (type) => {
    setOrderCancel({
      ...orderCancel,
      refundType: type,
      partialPayment:
        type === 'full'
          ? orderPayment
          : {
              shop: '',
              deliveryBoy: '',
              admin: '',
            },
    });
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
          resetUpdateStatusModal();
        }}
      >
        <UpdateOrderStatusForm
          nearByDeliveryBoysQuery={nearByDeliveryBoysQuery}
          updateStatusModal={updateStatusModal}
          currentOrderDelivery={currentOrderDelivery}
          currentButlerSearchKey={currentButlerSearchKey}
          setCurrentOrderDelivery={setCurrentOrderDelivery}
          resetUpdateStatusModal={resetUpdateStatusModal}
          updateStatusMutation={updateStatusMutation}
          setCurrentButlerSearchKey={setCurrentButlerSearchKey}
          currentOrder={currentOrder}
          currentOrderShop={currentOrderShop}
          setNewOrderStatus={setNewOrderStatus}
          newOrderStatus={newOrderStatus}
        />
      </Modal>

      {/* FLAG ADD */}
      <Modal
        open={flagModal}
        onClose={() => {
          resetFlagModal();
        }}
      >
        <UpdateFlag
          addFlagMutation={addFlagMutation}
          setFlagComment={setFlagComment}
          flagComment={flagComment}
          currentOrder={currentOrder}
          handleFlagTypeChange={handleFlagTypeChange}
          resetFlagModal={resetFlagModal}
          flagOptions={flagOptions}
          flagType={flagType}
        />
      </Modal>
      {/* Cancel order */}
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <OrderCancel
          deliverySearchKey={deliverySearchKey}
          cancelOrderByAdminMutation={cancelOrderByAdminMutation}
          cancelOrderForButlarMutation={cancelOrderForButlarMutation}
          orderCancel={orderCancel}
          appVat={appVat}
          updateRefundType={updateRefundType}
          getCancelReasonsQuery={getCancelReasonsQuery}
          setOrderCancel={setOrderCancel}
          orderPayment={orderPayment}
          setOpenCancelModal={setOpenCancelModal}
          setIsOtherReason={setIsOtherReason}
          isOtherReason={isOtherReason}
          setDeliverySearchKey={setDeliverySearchKey}
          newRefundType={newRefundType}
        />
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
          deliverySearchKey={deliverySearchKey}
          orderCancel={orderCancel}
          updateRefundType={updateRefundType}
          appVat={appVat}
          getCancelReasonsQuery={getCancelReasonsQuery}
          setOrderCancel={setOrderCancel}
          orderPayment={orderPayment}
          openRefundModal={openRefundModal}
          setOpenRefundModal={setOpenRefundModal}
          setIsOtherReason={setIsOtherReason}
          isOtherReason={isOtherReason}
          setDeliverySearchKey={setDeliverySearchKey}
          newRefundType={newRefundType}
          refundOrderMutation={refundOrderMutation}
        />
      </Modal>
    </Box>
  );
}
