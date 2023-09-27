/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */

import { successMsg } from '../../../../helpers/successMsg';

/*
baseCurrency_adminLoss
: 
"90.00"
baseCurrency_shopLoss
: 
"10.00"
secondaryCurrency_adminLoss
: 
0
secondaryCurrency_shopLoss
: 
0
*/

const getEndorseLoss = (cancelOrderData) => {
  const { endorseLoss, selectedItems, totalSelectedAmount } = cancelOrderData;

  const { baseCurrency_adminLoss, baseCurrency_shopLoss } = endorseLoss;

  const totalSecondaryCurrency = selectedItems?.reduce((prev, item) => prev + item?.secondaryCurrency, 0);

  const percentageOfShop = (100 / totalSelectedAmount) * Number(baseCurrency_shopLoss);

  const percentageOfAdmin = (100 / totalSelectedAmount) * Number(baseCurrency_adminLoss);

  const secondaryCurrency_adminLoss = totalSecondaryCurrency * (percentageOfAdmin / 100);
  const secondaryCurrency_shopLoss = totalSecondaryCurrency * (percentageOfShop / 100);

  return {
    baseCurrency_adminLoss: Number(baseCurrency_adminLoss) - Number(baseCurrency_shopLoss),
    baseCurrency_shopLoss: Number(baseCurrency_shopLoss) - Number(baseCurrency_adminLoss),
    secondaryCurrency_adminLoss: Number(secondaryCurrency_adminLoss) - Number(secondaryCurrency_shopLoss),
    secondaryCurrency_shopLoss: Number(secondaryCurrency_shopLoss) - Number(secondaryCurrency_adminLoss),
  };
};

export const validateCancelData = (order, cancelOrderData) => {
  const cancelOrderTemplate = {
    orderId: order?._id,
    logUser: cancelOrderData?.logUser, // all, rider, shop
    cancelReasonId: '',
    otherReason:
      cancelOrderData?.cancelReason === 'others' ? cancelOrderData?.otherReason : cancelOrderData?.cancelReason,
    isEndorseLoss: cancelOrderData?.isEndorseLoss === 'true', // true, false
    endorseLoss: {
      ...getEndorseLoss(cancelOrderData),
    },
  };

  if (!cancelOrderData?.logUser) {
    successMsg('Select Log users option!');
    return { status: false };
  }

  if (!cancelOrderData?.cancelReason) {
    successMsg('Select Cancel Reason type option !');
    return { status: false };
  }

  if (cancelOrderData?.cancelReason === 'others' && !cancelOrderData?.otherReason) {
    successMsg('Write other reason !');
    return { status: false };
  }

  if (!cancelOrderData?.isEndorseLoss) {
    successMsg('Select Endorese loss option !');
    return { status: false };
  }

  if (!cancelOrderData?.refundPercentage) {
    successMsg('Select Put cost on options!');
    return { status: false };
  }

  if (cancelOrderData?.isEndorseLoss === 'true' && !cancelOrderData?.selectedItems?.length) {
    successMsg('Select items!');
    return { status: false };
  }

  if (cancelOrderData?.endorseLoss?.baseCurrency_shopLoss <= 0) {
    successMsg('Put some amount on shop profit field!');
    return { status: false };
  }

  return { status: true, data: cancelOrderTemplate };
};
