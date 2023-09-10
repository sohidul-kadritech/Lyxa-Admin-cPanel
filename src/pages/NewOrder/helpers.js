/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable default-param-last */
import { Stack, Tooltip, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import moment from 'moment';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { getNextStatus } from '../../components/Shared/UpdateOrderStatus/helpers';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import { successMsg } from '../../helpers/successMsg';

export function TitleWithToolTip({ title, tooltip, sx }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2} sx={sx}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: '600',
          fontSize: '15px',
          lineHeight: '18px',
        }}
      >
        {title}
      </Typography>
      {tooltip && (
        <Tooltip
          arrow
          title={tooltip}
          sx={{
            '.MuiTooltip-popper': {
              zIndex: '9999999 !important',
            },
          }}
        >
          <InfoIcon />
        </Tooltip>
      )}
    </Stack>
  );
}

export const orderStatusMap = {
  placed: 'Placed',
  accepted_delivery_boy: 'Rider Accepted',
  preparing: 'Restaurant Accepted',
  ready_to_pickup: 'Ready to pickup',
  order_on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refused: 'Rejected',
  schedule: 'Scheduled',
};

// flag type options
export const butlerFlagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Butler', value: 'delivery' },
];

export const orderFlagTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Rider', value: 'delivery' },
  { label: 'Shop', value: 'shop' },
];

export const statusColorVariants = {
  placed: {
    color: '#FFB017',
    background: 'rgba(255, 176, 23, 0.15)',
  },

  accepted_delivery_boy: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  preparing: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  ready_to_pickup: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  order_on_the_way: {
    color: '#00A3FF',
    background: '#F1FAFF',
  },

  delivered: {
    color: '#417C45',
    background: '#DCFCE7',
  },

  schedule: {
    color: '#417C45',
    background: '#DCFCE7',
  },

  cancelled: {
    color: '#DD5B63',
    background: '#FEE2E2',
  },

  refused: {
    color: '#454545',
    background: '#F0F0F0',
  },
};

export const sortOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

const queryParamsInit = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  type: 'ongoing',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export const getQueryParamsInit = (showFor, currentUser) => {
  if (showFor === 'shop') {
    return { ...queryParamsInit, type: 'requested', shop: currentUser?.shop?._id };
  }

  if (showFor === 'seller') {
    return { ...queryParamsInit, seller: currentUser?.seller?._id };
  }

  return { ...queryParamsInit };
};

export const fiterOrders = (orders = [], filter) => {
  const filters = {
    ongoing: {
      placed: true,
      accepted_delivery_boy: true,
      preparing: true,
      ready_to_pickup: true,
      order_on_the_way: true,
    },

    delivered: {
      delivered: true,
    },

    incomplete: {
      cancelled: true,
      refused: true,
    },
  };

  const cFilter = filters[filter];

  return orders.filter((order) => cFilter && cFilter[order?.orderStatus]);
};

export const getOrderProfit = (order, adminType = 'shop') => {
  console.log('baseCurrency_shopEarnings', order);
  if (adminType === 'shop') {
    const shopVat = order?.vatAmount?.baseCurrency_vatForShop || 0;
    const shopEarning = order?.baseCurrency_shopEarnings;
    const totalPayout = shopVat + shopEarning;

    return totalPayout;
  }
  const summary = order?.summary;
  return (
    summary?.baseCurrency_totalAmount +
    summary?.baseCurrency_vat +
    summary?.baseCurrency_riderTip -
    summary?.baseCurrency_discount -
    summary?.reward?.baseCurrency_amount -
    summary?.baseCurrency_couponDiscountAmount
  );
};

export const getThreedotMenuOptions = (order, userType) => {
  const options = [];
  const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

  const updateStatus = { label: 'Update Status', value: 'update_status' };
  const trackOrder = { label: 'Track Order', value: 'track_order' };
  const cancelOrder = { label: 'Cancel Order', value: 'cancel_order' };
  const refundOrder = { label: 'Refund Order', value: 'refund_order' };
  const flagOrder = { label: 'Flag', value: 'flag' };

  const makePushOptions = (items) => {
    items.forEach((item) => {
      console.log('items', item);
      options.push(item);
    });
  };

  // console.log('order?.orderStatus', order?.orderStatus);

  if (hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0 && userType === 'admin') {
    makePushOptions([updateStatus, trackOrder, cancelOrder]);
  }

  if (
    userType === 'admin' &&
    order?.orderStatus === 'delivered' &&
    !order?.isRefundedAfterDelivered &&
    !order?.isButler
  ) {
    options.push(refundOrder);
  }

  if (userType === 'admin') {
    options.push(flagOrder);
  }

  return options;
};

export const getRefundedVatForAdmin = (adminVat, value, vatPercentage) => {
  const refundedVat = (vatPercentage / 100) * value;

  if (refundedVat > adminVat) return Number(adminVat.toFixed(2));

  if (refundedVat <= adminVat) return Number(refundedVat.toFixed(2));

  return 0;
};

export const calculateTotalRefundedAmount = (deliveryBoy, admin, shop, vatForAdmin) => {
  const calculatedValue = (Number(deliveryBoy) + Number(admin) + Number(shop + Number(vatForAdmin))).toFixed(2);
  return !calculatedValue && isNaN(calculatedValue) ? 0 : parseFloat(calculatedValue);
};

export const calculateTotalRefund = (array, refundType = '') => {
  if (refundType !== 'none' && array.length > 0)
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return 0;
};

export const returnNewValue = (value) => value;

export const getShopRefundedAmount = (adminEarning, shopEarning, vatAmount) =>
  adminEarning < 0
    ? shopEarning + vatAmount.baseCurrency_vatForShop + adminEarning
    : shopEarning + vatAmount.baseCurrency_vatForShop;

export const getAdminRefundedAmount = (adminEarning, deliveryBoy, type = '') => {
  if (type !== 'delivered') {
    return adminEarning < 0 ? 0 : adminEarning + deliveryBoy;
  }

  return adminEarning < 0 ? deliveryBoy : adminEarning + deliveryBoy;
};

export const orderCancelDataFormation = (menu, order, orderCancel) => {
  if (menu === 'cancel_order') {
    if (order?.isButler) {
      return {
        ...orderCancel,
        cancelReasonId: '',
        cartType: order?.cart?.cartType,
        otherReason: '',
        deliveryBoy: order?.deliveryBoy,
        orderFor: order?.orderFor,
        orderActivity: order?.orderActivity,
        paymentMethod: order?.paymentMethod,
        orderId: order?._id,
        refundType: 'none',
        partialPayment: {
          deliveryBoy: '',
          adminOrderProfit: '',
          adminRiderProfit: '',
        },
        vatAmount: order?.vatAmount,
        summary: order?.summary,
      };
    }

    return {
      ...orderCancel,
      cancelReasonId: '',
      otherReason: '',
      deliveryBoy: order?.deliveryBoy,
      orderFor: order?.orderFor,
      cartType: order?.cart?.cartType,
      orderActivity: order?.orderActivity,
      paymentMethod: order?.paymentMethod,
      shop: order?.shop,
      orderId: order?._id,
      refundType: 'none',
      vatAmount: order?.vatAmount,
      partialPayment: {
        deliveryBoy: '',
        adminOrderProfit: '',
        adminRiderProfit: '',
      },
      summary: order?.summary,
    };
  }

  if (menu === 'refund_order') {
    if (order?.isButler) {
      return {
        ...orderCancel,
        cancelReasonId: '',
        otherReason: '',
        cartType: order?.cart?.cartType,
        deliveryBoy: order?.deliveryBoy,
        paymentMethod: order?.paymentMethod,
        orderActivity: order?.orderActivity,
        orderFor: order?.orderFor,
        orderId: order?._id,
        vatAmount: order?.vatAmount,
        refundType: 'none',
        partialPayment: {
          deliveryBoy: '',
          adminOrderProfit: '',
          adminRiderProfit: '',
        },
        summary: order?.summary,
      };
    }

    return {
      ...orderCancel,
      cancelReasonId: '',
      otherReason: '',
      cartType: order?.cart?.cartType,
      deliveryBoy: order?.deliveryBoy,
      paymentMethod: order?.paymentMethod,
      orderFor: order?.orderFor,
      orderActivity: order?.orderActivity,
      shop: order?.shop,
      orderId: order?._id,
      refundType: 'none',
      partialPayment: {
        deliveryBoy: '',
        adminOrderProfit: '',
        adminRiderProfit: '',
      },
      vatAmount: order?.vatAmount,
      summary: order?.summary,
    };
  }

  return {};
};

export const generateRefundAfterDeliveredData = (orderCancel, orderPayment, appVat) => {
  // const riderAndAdmin = orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy;
  const riderAndAdmin = orderCancel?.partialPayment?.adminOrderProfit + orderCancel?.partialPayment?.adminRiderProfit;

  const shopVatAdmin = orderPayment?.shop + orderCancel?.vatAmount?.baseCurrency_vatForShop + orderPayment?.admin;
  const shopVat = orderPayment?.shop + orderCancel?.vatAmount?.baseCurrency_vatForShop;
  if (orderCancel?.refundType !== 'full') {
    return {
      orderId: orderCancel?.orderId,
      refundType: orderCancel?.refundType,
      partialPayment: {
        shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
        // admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
        adminOrderProfit: orderCancel?.partialPayment?.adminOrderProfit
          ? orderCancel?.partialPayment?.adminOrderProfit
          : 0,
        adminRiderProfit: orderCancel?.partialPayment?.adminRiderProfit
          ? orderCancel?.partialPayment?.adminRiderProfit
          : 0,
        adminVat: getRefundedVatForAdmin(orderCancel?.vatAmount?.baseCurrency_vatForAdmin, riderAndAdmin, appVat),
      },
    };
  }

  return {
    orderId: orderCancel?.orderId,
    refundType: orderCancel?.refundType,
    partialPayment: {
      shop: orderPayment?.admin < 0 ? shopVatAdmin : shopVat,
      adminOrderProfit: orderPayment?.admin < 0 ? 0 : orderPayment?.admin,
      adminRiderProfit: orderCancel?.partialPayment?.deliveryBoy,
      adminVat: getRefundedVatForAdmin(
        orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
        orderPayment?.admin < 0 ? orderPayment?.deliveryBoy || 0 : orderPayment?.admin + orderPayment?.deliveryBoy,
        appVat,
      ),
    },
  };
};
export const getCurrentStatus = (currentOrder) => {
  const haveOwnDeliveryBoy = currentOrder?.shop?.haveOwnDeliveryBoy;
  const currentStatus = getNextStatus(currentOrder);

  const currentOrderDelivery = currentOrder?.deliveryBoy;

  const shouldConvertStatusOnTheWay =
    currentStatus === 'ready_to_pickup' && haveOwnDeliveryBoy && !currentOrderDelivery;

  console.log('shouldConvertStatusOnTheWay', shouldConvertStatusOnTheWay);
  if (shouldConvertStatusOnTheWay) {
    return 'order_on_the_way';
  }

  return currentStatus;
};

export const validateAndGenerateStatusData = (currentOrder, paidCurrency) => {
  const currentStatus = getNextStatus(currentOrder);
  // const currentStatus = getCurrentStatus(currentOrder);

  const currentOrderDelivery = currentOrder?.deliveryBoy;

  const status = {
    status: false,
    msg: '',
  };

  if (!currentStatus) {
    successMsg('Please select status');
    return status;
  }

  if (currentStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
    successMsg('Please select rider');
    return status;
  }

  // if (
  //   (currentStatus === 'delivered' || currentStatus === 'preparing') &&
  //   !currentOrderDelivery?._id &&
  //   !currentOrder?.shop?.haveOwnDeliveryBoy
  // ) {
  //   successMsg(`Assign rider first`);
  //   return status;
  // }

  if (currentStatus === 'preparing' && !currentOrderDelivery) {
    successMsg(`Assign rider first`);
    return status;
  }

  if (currentStatus === 'delivered' && currentOrder?.paymentMethod === 'cash' && !paidCurrency) {
    successMsg(`Choose paid currency first`);
    return status;
  }

  const data = {};
  data.orderId = currentOrder?._id;
  data.orderStatus = currentStatus;
  data.shop = currentOrder?.shop?._id;
  data.deliveryBoy = currentOrderDelivery?._id === 'no-rider' ? undefined : currentOrderDelivery?._id;
  // if not selected will be undefined
  data.paidCurrency = paidCurrency || undefined;

  return { status: true, data };
};
