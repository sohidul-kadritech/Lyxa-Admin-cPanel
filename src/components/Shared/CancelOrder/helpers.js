import { deepClone } from '../../../helpers/deepClone';

/* eslint-disable no-unsafe-optional-chaining */
export const getCancelRefundTypeOptions = (order) => {
  const options = [
    { value: 'full', label: 'Full Refund' },
    { value: 'partial', label: 'Partial Refund' },
    { value: 'none', label: 'No Refund' },
  ];

  // hide partial option for group carts and until shop accept
  if (order?.cartType === 'group') return options.filter((opt) => opt.value !== 'partial');

  if (order?.orderFor === 'specific' && order?.orderActivity?.length <= 1)
    return options.filter((opt) => opt.value !== 'partial');

  if (order?.orderFor === 'global' && order?.orderActivity?.length <= 2)
    return options.filter((opt) => opt.value !== 'partial');

  if (order?.isButler) return options.filter((opt) => opt.value !== 'partial');

  return options;
};

export const getRefundMaxAmounts = (order) => {
  let deliveryBoy = order?.baseCurrency_riderFee;
  let deliveryBoySecondary = order?.secondaryCurrency_riderFee;
  let shop = order?.baseCurrency_shopEarnings + order?.vatAmount?.baseCurrency_vatForShop;
  let shopSecondary = order?.secondaryCurrency_shopEarnings + order?.vatAmount?.secondaryCurrency_vatForShop;

  if (order?.adminCharge?.baseCurrency_adminChargeFromDelivery < 0) {
    deliveryBoy -= Math.abs(order?.adminCharge?.baseCurrency_adminChargeFromDelivery);
    deliveryBoySecondary -= Math.abs(order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery);
  }

  if (order?.adminCharge?.baseCurrency_adminChargeFromOrder < 0) {
    shop -= Math.abs(order?.adminCharge?.baseCurrency_adminChargeFromOrder);
    shopSecondary -= Math.abs(order?.adminCharge?.secondaryCurrency_adminChargeFromOrder);
  }

  if (order?.isButler) {
    return {
      deliveryBoy,
      deliveryBoySecondary,

      adminRiderProfit: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromDelivery, 0),
      adminRiderProfitSecondary: Math.max(order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery, 0),

      adminVat: order?.summary?.baseCurrency_vat,
      adminVatSecondary: order?.vatAmount?.secondaryCurrency_vatForAdmin,
    };
  }

  // normal order
  return {
    shop,
    shopSecondary,

    deliveryBoy,
    deliveryBoySecondary,

    adminOrderProfit: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromOrder, 0),
    adminOrderProfitSecondary: Math.max(order?.adminCharge?.secondaryCurrency_adminChargeFromOrder, 0),

    adminRiderProfit: Math.max(order?.adminCharge?.baseCurrency_adminChargeFromDelivery, 0),
    adminRiderProfitSecondary: Math.max(order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery, 0),

    adminVat: order?.vatAmount?.baseCurrency_vatForAdmin,
    adminVatSecondary: order?.vatAmount?.secondaryCurrency_vatForAdmin,
  };
};

export const getCancelOrderInit = (order) => ({
  orderId: order?._id,
  cancelReasonId: null,
  otherReason: '',
  refundType: order?.paymentMethod === 'cash' ? 'none' : 'full',
  partialPayment: {
    shop: '',
    deliveryBoy: '',
    adminOrderProfit: '',
    adminRiderProfit: '',
    adminVat: '',
  },
});

export const getTotalRefundAmount = ({ maxAmounts, cancelData, secondaryValues = {} }) => {
  console.log({ maxAmounts });

  let base = 0;
  let secondary = 0;

  if (cancelData?.refundType === 'full') {
    Object.entries(maxAmounts).forEach(([key, value]) => {
      if (key.search('Secondary') > -1) {
        secondary += Number(value);
      } else {
        base += Number(value);
      }
    });

    return { base, secondary };
  }

  if (cancelData?.refundType === 'partial') {
    base = Object.values(cancelData.partialPayment).reduce((a, b) => a + Number(b), 0);
    secondary = Object.values(secondaryValues).reduce((a, b) => a + Number(b), 0);
  }

  return { base, secondary };
};

export const validateCancelData = ({ cancelData, isOtherReason, maxAmounts }) => {
  const keyToLabelMap = {
    shop: 'Shop Profit',
    deliveryBoy: 'DeliveryBoy Profit',
    adminOrderProfit: 'Lyxa Order Profit',
    adminRiderProfit: 'Lyxa Rider Profit',
    adminVat: 'adminVat Profit',
  };

  const error = {
    error: true,
    msg: null,
  };

  if (isOtherReason && !cancelData?.otherReason?.trim()) error.msg = 'Please enter reason for other refund';

  if (!isOtherReason && !cancelData?.cancelReasonId) error.msg = 'Please select reason for refund';

  if (cancelData?.refundType === 'partial') {
    Object.entries(cancelData.partialPayment).forEach(([key, value]) => {
      if (key === 'adminVat') return;

      if (maxAmounts[key] > 0 && value === '') {
        error.msg = `Please enter ${keyToLabelMap[key]} refund amount`;
      }

      if (Number.isNaN(Number(value)) || value < 0) {
        error.msg = `${keyToLabelMap[key]} refund amount is invalid`;
      }
    });

    const { base: totalRefundAmount } = getTotalRefundAmount({ maxAmounts, cancelData });

    if (!totalRefundAmount) {
      error.msg = `Total refund amount is invalid`;
    }
  }

  if (error.msg) return error;

  return {
    error: false,
  };
};

export const createCancelOrderPayload = (cancelData) => {
  const data = deepClone(cancelData);

  data.cancelReasonId = data?.cancelReasonId ? data?.cancelReasonId?._id : '';

  Object.keys(data.partialPayment).forEach((key) => {
    data.partialPayment[key] = Number(data.partialPayment[key]);
  });

  return data;
};
