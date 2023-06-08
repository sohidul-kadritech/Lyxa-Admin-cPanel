/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable default-param-last */
import moment from 'moment';

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
    color: '#5BBD4E',
    background: 'rgba(91, 189, 78, 0.08)',
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
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export const getQueryParamsInit = (showFor, currentUser) => {
  if (showFor === 'shop') {
    return { ...queryParamsInit, shop: currentUser?.shop?._id };
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
  const totalAmount = order?.summary?.productAmount + (order?.orderFor !== 'global' ? order?.summary?.deliveryFee : 0);
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  if (adminType === 'shop') return (totalAmount - order?.dropCharge?.dropChargeFromOrder)?.toFixed(2);
  return totalPayment;
};

export const getThreedotMenuOptions = (order, userType) => {
  const options = [];
  const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];
  console.log('Order status: ', order?.orderStatus);
  if (hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0) {
    options.push({ label: 'Update Status', value: 'update_status' });
  }

  if (userType === 'admin' && hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0) {
    options.push({ label: 'Cancel Order', value: 'cancel_order' });
  }

  if (userType === 'admin' && order?.orderStatus === 'delivered' && !order?.isRefundedAfterDelivered) {
    options.push({ label: 'Refund Order', value: 'refund_order' });
  }

  if (userType === 'admin') {
    options.push({ label: 'Flag', value: 'flag' });
  }

  return options;
};

export const getRefundedVatForAdmin = (adminVat, value, vatPercentage) => {
  const refundedVat = (vatPercentage / 100) * value;
  console.log('refunded vat: ', refundedVat);
  if (refundedVat > adminVat) {
    return Number(adminVat.toFixed(2));
  }
  if (refundedVat <= adminVat) return Number(refundedVat.toFixed(2));

  return 0;
};

export const calculateTotalRefundedAmount = (deliveryBoy, admin, shop, vatForAdmin) => {
  console.log(
    'deliveryBoy',
    deliveryBoy,
    'admin',
    admin,
    'shop',
    shop,
    'vatforAdmin',
    // eslint-disable-next-line prettier/prettier
    vatForAdmin
  );
  return (deliveryBoy + admin + shop + Number(vatForAdmin)).toFixed(2);
};

export const calculateTotalRefund = (array, refundType = '') => {
  console.log('array', array, refundType);
  if (refundType !== 'none' && array.length > 0)
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return 0;
};

export const returnNewValue = (value) => {
  console.log(value);
  return value;
};

// orderPayment?.admin < 0 ? 0 : admin + deliveryBoy;

export const getShopRefundedAmount = (adminEarning, shopEarning, vatAmount) =>
  adminEarning < 0 ? shopEarning + vatAmount.vatForShop + adminEarning : shopEarning + vatAmount.vatForShop;

export const getAdminRefundedAmount = (adminEarning, deliveryBoy, type = '') => {
  if (type !== 'delivered') {
    return adminEarning < 0 ? 0 : adminEarning + deliveryBoy;
  }

  return adminEarning < 0 ? deliveryBoy : adminEarning + deliveryBoy;
};
