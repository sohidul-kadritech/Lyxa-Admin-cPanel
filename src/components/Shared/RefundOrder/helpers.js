/* eslint-disable max-len */
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

  console.log({ shop, adminCharge: order?.adminCharge?.baseCurrency_adminChargeFromOrder });

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

  const totalRefundAmount = adminOrderRefund + adminDeliveryRefund + shop + adminVat;

  const vatPercentage = refundData?.vatPercentage;
  const amountWithVatPercentage = vatPercentage + 100;

  /* store order amount as remaining */
  let remainingAmount = totalOrderAmount;

  /* update remaining amount wihout VAT */
  remainingAmount *= 100 / amountWithVatPercentage;

  /* calculating VAT of remaining amount */
  const remainAmountVat = remainingAmount * (vatPercentage / 100);

  /* check updated remaining amount VAT is greater than maximum VAT or not, the minimum VAT will be deducted from totalOrderAmount */
  remainingAmount = totalOrderAmount - Math.min(initialMax?.adminVat, remainAmountVat);
  remainingAmount = Number(remainingAmount.toFixed(2));

  if (shop > 0) {
    /* check difference of totalOrderAmount and totalRefunded amount is still positive or not 
    if positive shop max limit is totalOrderAmount or not otherwise maxOfShop value is max */
    const maxOfShop = totalOrderAmount - adminDeliveryRefund - adminOrderRefund - adminVat;
    initialMax.shop = totalOrderAmount - totalRefundAmount > 0 ? totalOrderAmount : maxOfShop;

    /* calculating new shop limit */
    remainingAmount = totalOrderAmount - shop;
    remainingAmount *= 100 / amountWithVatPercentage;
    const remainAmountVat = remainingAmount * (vatPercentage / 100);
    remainingAmount = totalOrderAmount - shop - Math.min(initialMax?.adminVat, remainAmountVat);
    remainingAmount = Number(remainingAmount.toFixed(2));
  }

  /* calculating minimum of delivery refund amount between remaining amount and delivery earning */
  const deliveryRefundMaxAmount = Math.min(remainingAmount - adminOrderRefund, earning?.adminDeliveryRefund);

  /* updating new max delivery refund amount */
  initialMax.adminDeliveryRefund = deliveryRefundMaxAmount > 0 ? deliveryRefundMaxAmount : 0;

  /* updating new remaining amount */
  remainingAmount -= Math.max(deliveryRefundMaxAmount, 0);
  remainingAmount = Number(remainingAmount.toFixed(2));

  /* updating new max admin order refund  */
  initialMax.adminOrderRefund = remainingAmount > 0 ? remainingAmount : 0;

  console.log('remainingAmount', remainingAmount);

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
