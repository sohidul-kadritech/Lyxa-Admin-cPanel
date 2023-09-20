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

  const totalOrderAmount =
    order?.summary?.baseCurrency_card + order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet;
  refundData.partialPayment.adminDeliveryRefund = isNumber(Number(refundData?.partialPayment?.adminDeliveryRefund))
    ? Number(refundData?.partialPayment?.adminDeliveryRefund)
    : 0;

  refundData.partialPayment.adminOrderRefund = isNumber(Number(refundData?.partialPayment?.adminOrderRefund))
    ? Number(refundData?.partialPayment?.adminOrderRefund)
    : 0;
  console.log('temp 0 ', refundData);

  refundData.partialPayment.shop = isNumber(Number(refundData?.partialPayment?.shop))
    ? Number(refundData?.partialPayment?.shop)
    : 0;

  refundData.partialPayment.adminVat = isNumber(Number(refundData?.partialPayment?.adminVat))
    ? Number(refundData?.partialPayment?.adminVat)
    : 0;

  const totalEarning = Number(earning?.adminOrderRefund) + Number(earning?.shop);

  if (value >= initialMax[key]) {
    return initialMax;
  }

  console.log('temp 0 1 ', refundData);

  if (
    refundData?.partialPayment?.adminOrderRefund === 0 &&
    refundData?.partialPayment?.adminDeliveryRefund >= 0 &&
    refundData?.partialPayment?.shop >= 0
  ) {
    initialMax.adminDeliveryRefund = 0;
    initialMax.adminOrderRefund = 0;
    initialMax.shop = totalOrderAmount;
    console.log('temp');

    if (refundData?.partialPayment?.shop <= totalEarning) {
      initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
      initialMax.adminOrderRefund = totalEarning - (value || 0);
      initialMax.shop = totalOrderAmount;

      if (refundData?.partialPayment?.adminDeliveryRefund >= 0) {
        initialMax.shop =
          totalOrderAmount - refundData?.partialPayment?.adminDeliveryRefund - refundData?.partialPayment?.adminVat;
      }
    }

    if (refundData?.partialPayment?.shop > totalEarning && refundData?.partialPayment?.shop < totalOrderAmount) {
      const adminDelivery = totalOrderAmount - refundData?.partialPayment?.shop;

      const adminDeliveryRefund = adminDelivery - (adminDelivery * refundData?.vatPercentage) / 100;
      // adminDeliveryRefund -= (adminDeliveryRefund * refundData?.vatPercentage) / 100;

      console.log('temp admin', adminDeliveryRefund, (adminDelivery * refundData?.vatPercentage) / 100);

      initialMax.adminDeliveryRefund = adminDeliveryRefund.toFixed(2);

      initialMax.adminOrderRefund = 0;
      initialMax.shop = totalOrderAmount;
    }

    return initialMax;
  }

  if (refundData?.partialPayment?.adminOrderRefund > 0 && refundData?.partialPayment?.shop === 0) {
    let tmp = totalEarning;
    tmp -= value;
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = totalEarning;
    initialMax.shop = tmp;

    return initialMax;
  }

  if (
    refundData?.partialPayment?.adminOrderRefund >= 0 &&
    refundData?.partialPayment?.adminDeliveryRefund >= 0 &&
    refundData?.partialPayment?.shop >= 0
  ) {
    let tmp = totalEarning;
    initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
    initialMax.adminOrderRefund = 0;
    initialMax.shop = 0;

    if (key === 'shop') {
      tmp -= refundData?.partialPayment?.adminOrderRefund;
      initialMax[key] = tmp;
      initialMax.adminOrderRefund = totalEarning;

      console.log('temp', tmp, initialMax, key, value);
      return initialMax;
    }

    if (key === 'adminOrderRefund') {
      tmp -= refundData?.partialPayment?.shop;
      initialMax[key] = tmp;
      initialMax.shop = totalEarning;
      console.log('temp', tmp, initialMax, key, value);
      return initialMax;
    }

    return initialMax;
  }

  initialMax.adminDeliveryRefund = earning?.adminDeliveryRefund;
  initialMax.adminOrderRefund = totalEarning;
  initialMax.shop =
    totalOrderAmount - refundData?.partialPayment?.adminDeliveryRefund - refundData?.partialPayment?.adminVat;

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
