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

  const totalRefundAmount = adminOrderRefund + adminDeliveryRefund + shop + adminVat;

  const vatPercentage = refundData?.vatPercentage;
  const amountWithVatPercentage = vatPercentage + 100;

  let remainingAmountShouldBeForOrderAndDelivery = totalOrderAmount - shop;
  remainingAmountShouldBeForOrderAndDelivery *= 100 / amountWithVatPercentage;
  remainingAmountShouldBeForOrderAndDelivery = Number(remainingAmountShouldBeForOrderAndDelivery.toFixed(2));

  console.log('temp 0 remaining amount', remainingAmountShouldBeForOrderAndDelivery);

  /* store total refund */
  console.log('temp 0 refund', totalRefundAmount, totalRefundAmount >= totalOrderAmount);

  console.log('temp 1', { adminDeliveryRefund, adminOrderRefund, shop });

  if (totalRefundAmount >= totalOrderAmount) {
    if (adminOrderRefund <= 0) {
      initialMax.adminOrderRefund = 0;
    }

    if (adminDeliveryRefund <= 0) {
      initialMax.adminDeliveryRefund = 0;
    }
    if (shop <= 0) {
      initialMax.shop = 0;
    }

    if (key === 'shop') {
      const tempRemaining = totalOrderAmount - totalRefundAmount;
      initialMax.shop = tempRemaining < 0 ? shop - (totalRefundAmount - totalOrderAmount) : totalOrderAmount;
    }
    if (key !== 'shop') {
      initialMax.adminDeliveryRefund = remainingAmountShouldBeForOrderAndDelivery - adminOrderRefund;
      initialMax.adminOrderRefund = remainingAmountShouldBeForOrderAndDelivery - adminDeliveryRefund;

      return initialMax;
    }

    return initialMax;
  }

  if (shop > totalEarning && shop < totalOrderAmount && shop > 0) {
    if (remainingAmountShouldBeForOrderAndDelivery > earning?.adminDeliveryRefund) {
      initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
      initialMax.adminOrderRefund = remainingAmountShouldBeForOrderAndDelivery - adminDeliveryRefund;
    } else {
      initialMax.adminDeliveryRefund = remainingAmountShouldBeForOrderAndDelivery;
      initialMax.adminOrderRefund = remainingAmountShouldBeForOrderAndDelivery - adminDeliveryRefund;
    }

    return initialMax;
  }

  if (shop >= totalOrderAmount) {
    initialMax.adminDeliveryRefund = 0;
    initialMax.adminOrderRefund = 0;
    return initialMax;
  }

  if (shop <= 0 && adminOrderRefund < totalEarning) {
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = totalEarning;
    initialMax.shop = totalOrderAmount;
    return initialMax;
  }

  if (shop <= 0 && adminOrderRefund >= totalEarning) {
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = totalEarning;
    initialMax.shop = 0;
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
