/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable default-param-last */
import { Stack, Tooltip, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import moment from 'moment';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';

export function TitleWithToolTip({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
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
    </Stack>
  );
}

export const orderStatusMap = {
  placed: 'Pending',
  accepted_delivery_boy: 'Rider Accepted',
  preparing: 'Restaurant Accepted',
  ready_to_pickup: 'Ready to pickup',
  order_on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refused: 'Rejected',
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
  startDate: moment().startOf('month'),
  endDate: moment(),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export const getQueryParamsInit = (showFor, currentUser) => {
  if (showFor === 'shop') {
    return { ...queryParamsInit, shop: currentUser?.shop?._id };
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
  if (adminType === 'shop') return order?.sellerEarnings;
  return order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
};

export const getThreedotMenuOptions = (order, userType) => {
  const options = [];
  const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

  if (hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0) {
    options.push({ label: 'Update Status', value: 'update_status' });
    options.push({ label: 'Track Order', value: 'track_order' });
  }

  if (userType === 'admin' && hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0) {
    options.push({ label: 'Cancel Order', value: 'cancel_order' });
  }

  if (
    userType === 'admin' &&
    order?.orderStatus === 'delivered' &&
    !order?.isRefundedAfterDelivered &&
    !order?.isButler
  ) {
    options.push({ label: 'Refund Order', value: 'refund_order' });
  }

  if (userType === 'admin') {
    options.push({ label: 'Flag', value: 'flag' });
  }

  return options;
};

export const getRefundedVatForAdmin = (adminVat, value, vatPercentage) => {
  const refundedVat = (vatPercentage / 100) * value;

  if (refundedVat > adminVat) {
    return Number(adminVat.toFixed(2));
  }
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
  adminEarning < 0 ? shopEarning + vatAmount.vatForShop + adminEarning : shopEarning + vatAmount.vatForShop;

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
          admin: '',
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
        admin: '',
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
          admin: '',
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
        admin: '',
      },
      vatAmount: order?.vatAmount,
      summary: order?.summary,
    };
  }

  return {};
};

export const generateRefundAfterDeliveredData = (orderCancel, orderPayment, appVat) => {
  const riderAndAdmin = orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy;
  const shopVatAdmin = orderPayment?.shop + orderCancel?.vatAmount?.vatForShop + orderPayment?.admin;
  const shopVat = orderPayment?.shop + orderCancel?.vatAmount?.vatForShop;
  if (orderCancel?.refundType !== 'full') {
    return {
      orderId: orderCancel?.orderId,
      refundType: orderCancel?.refundType,
      partialPayment: {
        shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
        admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
        adminVat: getRefundedVatForAdmin(
          orderCancel?.vatAmount?.vatForAdmin,
          riderAndAdmin,
          // eslint-disable-next-line prettier/prettier
          appVat
        ),
      },
    };
  }

  return {
    orderId: orderCancel?.orderId,
    refundType: orderCancel?.refundType,
    partialPayment: {
      shop: orderPayment?.admin < 0 ? shopVatAdmin : shopVat,
      admin: orderPayment?.admin < 0 ? orderPayment?.deliveryBoy || 0 : orderPayment?.admin + orderPayment?.deliveryBoy,
      adminVat: getRefundedVatForAdmin(
        orderCancel?.vatAmount?.vatForAdmin,
        orderPayment?.admin < 0 ? orderPayment?.deliveryBoy || 0 : orderPayment?.admin + orderPayment?.deliveryBoy,
        // eslint-disable-next-line prettier/prettier
        appVat
      ),
    },
  };
};
