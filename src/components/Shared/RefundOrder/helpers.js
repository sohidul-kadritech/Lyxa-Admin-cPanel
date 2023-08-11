/* eslint-disable no-unsafe-optional-chaining */
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
    shop: '',
    adminOrderProfit: '',
    adminRiderProfit: '',
    adminVat: '',
  },
};

export const getRefundMaxAmounts = (order) => {
  let shop = order?.baseCurrency_shopEarnings + order?.vatAmount?.baseCurrency_vatForShop;

  // if negative it will be deducted from shop earnings
  if (order?.adminCharge?.baseCurrency_adminChargeFromOrder < 0) {
    shop -= Math.abs(order?.adminCharge?.baseCurrency_adminChargeFromOrder);
  }

  return {
    shop,
    adminOrderProfit: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromOrder, 0),
    adminRiderProfit: order?.adminCharge?.baseCurrency_adminChargeFromDelivery + order?.baseCurrency_riderFee,
    adminVat: order?.vatAmount?.baseCurrency_vatForAdmin,
  };
};

export const getTotalRefundAmount = ({ refundData, maxAmounts }) => {
  if (refundData?.refundType === 'full') {
    return maxAmounts.shop + maxAmounts.adminRiderProfit + maxAmounts.adminOrderProfit + maxAmounts.adminVat;
  }

  return (
    Number(refundData.partialPayment.shop) +
    Number(refundData.partialPayment.adminRiderProfit) +
    Number(refundData.partialPayment.adminOrderProfit) +
    Number(refundData.partialPayment.adminVat)
  );
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
