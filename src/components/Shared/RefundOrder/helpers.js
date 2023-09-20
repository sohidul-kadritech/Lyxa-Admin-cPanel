/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { isNumber } from 'lodash';
import { deepClone } from '../../../helpers/deepClone';

export const refundTypeOptions = (order) => {
  const options = [
    { label: 'Full', value: 'full' },
    { label: 'Partial', value: 'partial' },
  ];

  if (order?.cartType === 'group') return options.filter((opt) => opt.value !== 'partial');
  return options;
};

export const refundDataInit = {
  orderId: '',
  refundType: 'full',
  partialPayment: {
    shop: 0,
    adminOrderRefund: 0,
    adminDeliveryRefund: 0,
    adminVat: 0,
  },
};

export const getRefundMaxAmounts = (order) => {
  let shop = order?.baseCurrency_shopEarnings + order?.vatAmount?.baseCurrency_vatForShop;
  let shopSecondary = order?.secondaryCurrency_shopEarnings + order?.vatAmount?.secondaryCurrency_vatForShop;

  // if negative it will be deducted from shop earnings
  if (order?.adminCharge?.baseCurrency_adminChargeFromOrder < 0) {
    shop -= Math.abs(order?.adminCharge?.baseCurrency_adminChargeFromOrder);
    shopSecondary -= Math.abs(order?.adminCharge?.secondaryCurrency_adminChargeFromOrder);
  }

  return {
    shop,
    shopSecondary,

    adminOrderRefund: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromOrder, 0),
    adminOrderProfitSecondary: Math.max(order?.adminCharge?.secondaryCurrency_adminChargeFromOrder, 0),

    adminDeliveryRefund: order?.adminCharge?.baseCurrency_adminChargeFromDelivery + order?.baseCurrency_riderFee,
    adminRiderProfitSecondary:
      order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery + order?.secondaryCurrency_riderFee,

    adminVat: order?.vatAmount?.baseCurrency_vatForAdmin,
    adminVatSecondary: order?.vatAmount?.secondaryCurrency_vatForAdmin,
    // adminOrderRefundTemp: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromOrder, 0),
    // adminDeliveryRefundTemp: order?.adminCharge?.baseCurrency_adminChargeFromDelivery + order?.baseCurrency_riderFee,
  };
};

export const getNewRefundMaxAmounts = (order, refundData, maxAmounts, earning, key, value) => {
  const initialMax = maxAmounts;

  /* stored order amount with card,cash,wallet */
  const orderWithCard = Number(order?.summary?.baseCurrency_card || 0);
  const orderWithCash = Number(order?.summary?.baseCurrency_cash || 0);
  const orderWithWallet = Number(order?.summary?.baseCurrency_wallet || 0);

  /* calculate order amount */
  const totalOrderAmount = orderWithCard + orderWithCash + orderWithWallet;

  /* stored refund amount */
  const adminDeliveryRefund = isNumber(Number(refundData?.partialPayment?.adminDeliveryRefund))
    ? Number(refundData?.partialPayment?.adminDeliveryRefund)
    : 0;

  const adminOrderRefund = isNumber(Number(refundData?.partialPayment?.adminOrderRefund))
    ? Number(refundData?.partialPayment?.adminOrderRefund)
    : 0;

  const shop = isNumber(Number(refundData?.partialPayment?.shop)) ? Number(refundData?.partialPayment?.shop) : 0;

  const adminVat = isNumber(Number(refundData?.partialPayment?.adminVat))
    ? Number(refundData?.partialPayment?.adminVat)
    : 0;

  /* store total earning of order amount for lyxa and shop */
  const totalEarning = Number(earning?.adminOrderRefund) + Number(earning?.shop);

  console.log('temp 1', { adminDeliveryRefund, adminOrderRefund, shop });

  if (value >= initialMax[key]) {
    return initialMax;
  }

  /* when refund only for shop (Shop) */
  if (adminOrderRefund <= 0 && adminDeliveryRefund <= 0 && shop > 0) {
    const maxForDelivery = totalOrderAmount - adminOrderRefund - shop - adminVat;
    const maxForOrderAdmin = totalOrderAmount - adminDeliveryRefund - shop - adminVat;
    initialMax.adminDeliveryRefund = maxForDelivery <= 0 ? 0 : maxForDelivery;
    initialMax.adminOrderRefund = maxForOrderAdmin <= 0 ? 0 : maxForOrderAdmin;
    initialMax.shop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;

    if (shop >= totalOrderAmount) {
      initialMax.adminDeliveryRefund = 0;
      initialMax.adminOrderRefund = 0;
    }

    console.log('shop', initialMax);

    return initialMax;
  }

  /* when refund only give from delivery and shop (Shop,  Delivery) */
  if (adminOrderRefund <= 0 && adminDeliveryRefund > 0 && shop > 0) {
    const maxForOrderAdmin = totalOrderAmount - adminDeliveryRefund - shop - adminVat;

    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = maxForOrderAdmin <= 0 ? 0 : maxForOrderAdmin;
    initialMax.shop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;

    /* if shop pay greater than shop earning */
    if (shop > totalEarning) {
      initialMax.adminDeliveryRefund = totalOrderAmount - shop - adminVat;
      initialMax.shop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;
    }
    console.log('shop delivery', initialMax);
    return initialMax;
  }

  /* when refund  give from lyxa  order,delivery and shop (Shop, Order, Delivery) */
  if (adminOrderRefund > 0 && adminDeliveryRefund > 0 && shop > 0) {
    const maxForOrderAdmin = totalOrderAmount - adminDeliveryRefund - shop - adminVat;
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = maxForOrderAdmin <= 0 ? 0 : Number((maxForOrderAdmin || 0).toFixed(2));
    initialMax.shop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;

    console.log('shop order delivery', initialMax);
    return initialMax;
  }

  /* when refund  give from lyxa  order,delivery (Order, Delivery) */
  if (adminOrderRefund > 0 && adminDeliveryRefund > 0 && shop <= 0) {
    const maxForOrderAdmin = totalEarning - adminVat;
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = maxForOrderAdmin <= 0 ? 0 : maxForOrderAdmin;
    initialMax.shop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;

    console.log('order deilvery', initialMax);

    return initialMax;
  }

  /* when refund  give from shop ,lyxa order (Shop, Order) */
  if (adminOrderRefund > 0 && adminDeliveryRefund <= 0 && shop > 0) {
    const maxForShop = totalEarning - adminOrderRefund - adminVat;
    const maxForOrderAdmin = totalEarning - shop - adminVat;
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund - adminVat;
    initialMax.adminOrderRefund = maxForOrderAdmin <= 0 ? 0 : maxForOrderAdmin;
    initialMax.shop = maxForShop <= 0 ? 0 : maxForShop;

    console.log('shop order', initialMax);

    return initialMax;
  }

  initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
  initialMax.adminOrderRefund = totalEarning;

  initialMax.shop = totalOrderAmount;

  return initialMax;
};

export const getTotalRefundAmount = ({ refundData, maxAmounts, secondaryValues }) => {
  let base = 0;
  let secondary = 0;

  if (refundData?.refundType === 'full') {
    Object.entries(maxAmounts).forEach(([key, value]) => {
      if (key.search('Secondary') > -1) {
        secondary += Number(value);
      } else {
        base += Number(value);
      }
    });

    return { base, secondary };
  }

  if (refundData?.refundType === 'partial') {
    base = Object.values(refundData.partialPayment).reduce((a, b) => a + Number(b), 0);
    secondary = Object.values(secondaryValues).reduce((a, b) => a + Number(b), 0);
    return { base, secondary };
  }

  return { base, secondary };
};

export const validateRefundData = (refundData, maxAmounts) => {
  const error = {
    error: true,
    msg: null,
  };

  const keyToLabelMap = {
    shop: 'Shop',
    adminRiderProfit: 'Admin rider profit',
    adminOrderProfit: 'Admin order profit',
  };

  const data = deepClone(refundData);

  Object.keys(data.partialPayment).forEach((key) => {
    // if showing this field but is empty
    if (maxAmounts[key] > 0 && data.partialPayment[key] === '') error.msg = `${keyToLabelMap[key]} cut is required`;

    data.partialPayment[key] = Number(data.partialPayment[key]);
  });

  if (data?.partialPayment?.shop < 0 || Number.isNaN(data?.partialPayment?.shop)) {
    error.msg = 'Shop profit cut is invalid';
  }

  if (data?.partialPayment?.adminRiderProfit < 0 || Number.isNaN(data?.partialPayment?.adminRiderProfit)) {
    error.msg = 'Admin rider profit cut is invalid';
  }

  if (data?.partialPayment?.adminOrderProfit < 0 || Number.isNaN(data?.partialPayment?.adminOrderProfit)) {
    error.msg = 'Admin order profit cut is invalid';
  }

  if (error.msg) return error;

  return data;
};
