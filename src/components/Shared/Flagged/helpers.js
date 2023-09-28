/* eslint-disable no-unused-vars */
import { successMsg } from '../../../helpers/successMsg';
import { getRefundMaxAmounts } from '../RefundOrder/helpers';
import { calculateVat } from './Refund/helpers';

export const validateFlagData = (order, flaggData, VAT) => {
  const flaggTemplate = {
    orderId: order?._id,
    comment: '',
    user: order?.user?._id,
    shop: '',
    delivery: '',
    flaggedReason: flaggData?.flaggedReason, // "missing-item" || "wrong-item" || "others"
    otherReason: flaggData?.otherReason,
    replacement: flaggData?.replacement, // "with" || "without"
    refund: flaggData?.replacement, // "with" || "without"
  };

  const refundTemplate = {
    orderId: order?._id,
    refundType: flaggData?.refundType,
    partialPayment: {
      shop: flaggData?.partialPayment?.shop,
      adminOrderRefund: flaggData?.partialPayment?.adminOrderRefund,
      adminDeliveryRefund: flaggData?.partialPayment?.adminDeliveryRefund,
      adminVat: flaggData?.partialPayment?.adminVat,
    },
    logUser: flaggData?.logUser, // "all" || "rider" || "shop"
    flaggedReason: flaggData?.flaggedReason, // "missing-item" || "wrong-item" || "others"
    otherReason: flaggData?.otherReason,
  };

  const { vatAmount } = order;
  const { baseCurrency_vatForAdmin, baseCurrency_vatForShop } = vatAmount;

  const totalVat = baseCurrency_vatForAdmin + baseCurrency_vatForShop;

  if (!flaggData?.logUser) {
    successMsg('Select Log users option!');
    return { status: false };
  }

  if (!flaggData?.flaggedReason) {
    successMsg('Select Flagged Reason type option !');
    return { status: false };
  }

  if (!flaggData?.replacement) {
    successMsg('Select replacement type option !');
    return { status: false };
  }

  if (!flaggData?.refund) {
    successMsg('Select refund option !');
    return { status: false };
  }

  if (flaggData?.refund === 'with' && !flaggData?.refundType) {
    successMsg('Select refund type first !');
    return { status: false };
  }

  if (flaggData?.flaggedReason === 'others' && !flaggData?.otherReason) {
    successMsg('Write other reason !');
    return { status: false };
  }

  if (flaggData?.refund === 'with' && flaggData?.refundType === 'full') {
    refundTemplate.partialPayment = getRefundMaxAmounts(order);
    return { status: true, data: refundTemplate };
  }
  if (flaggData?.refund === 'with' && flaggData?.refundType === 'partial') {
    refundTemplate.partialPayment.shop += calculateVat(order, flaggData, VAT).vatForShop;

    refundTemplate.partialPayment.adminVat = (
      calculateVat(order, flaggData, VAT).totalVat - calculateVat(order, flaggData, VAT).vatForShop
    ).toFixed(2);

    refundTemplate.partialPayment.adminVat = parseFloat(refundTemplate.partialPayment.adminVat);

    return { status: true, data: refundTemplate };
  }

  if (flaggData?.refund === 'with' && flaggData?.refundType) {
    return { status: true, data: refundTemplate };
  }

  if (flaggData?.logUser === 'all') {
    flaggTemplate.delivery = order?.deliveryBoy?._id;
    flaggTemplate.shop = order?.shop?._id;
  }

  if (flaggData?.logUser === 'shop') {
    flaggTemplate.shop = order?.shop?._id;
  }

  if (flaggData?.logUser === 'rider') {
    flaggTemplate.delivery = order?.deliveryBoy?._id;
  }

  if (flaggData?.replacement === 'without' && flaggData?.refund === 'without') {
    return { status: true, data: flaggTemplate };
  }

  return flaggData;
};
