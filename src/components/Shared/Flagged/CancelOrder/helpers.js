/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */

import { successMsg } from '../../../../helpers/successMsg';

const getEndorseLoss = (cancelOrderData) => {
  const { endorseLoss, selectedItems, totalSelectedAmount } = cancelOrderData;

  const { baseCurrency_adminLoss, baseCurrency_shopLoss } = endorseLoss;
  const deliveryfee = selectedItems?.find((item) => item?.id === 'delivery_fee');

  let baseShop = 0;

  let baseAdmin = 0;

  if (baseCurrency_shopLoss <= deliveryfee?.price) {
    baseShop = baseCurrency_shopLoss - baseCurrency_adminLoss + ((deliveryfee?.price || 0) - baseCurrency_shopLoss);
    baseAdmin = baseCurrency_adminLoss;
  } else {
    baseShop = baseCurrency_shopLoss - baseCurrency_adminLoss;
    baseAdmin = baseCurrency_adminLoss - (baseCurrency_shopLoss - (deliveryfee?.price || 0));
  }

  const totalSecondaryCurrency = selectedItems?.reduce((prev, item) => prev + item?.secondaryCurrency, 0);

  const percentageOfShop = (100 / totalSelectedAmount) * Number(baseShop);

  const percentageOfAdmin = (100 / totalSelectedAmount) * Number(baseAdmin);

  const secondaryCurrency_adminLoss = Math.round(totalSecondaryCurrency * (percentageOfAdmin / 100));
  const secondaryCurrency_shopLoss = Math.round(totalSecondaryCurrency * (percentageOfShop / 100));

  return {
    baseCurrency_adminLoss: baseAdmin,
    baseCurrency_shopLoss: baseShop,
    secondaryCurrency_adminLoss,
    secondaryCurrency_shopLoss,
  };
};

export const validateCancelData = (order, cancelOrderData) => {
  const deliveryfee = cancelOrderData?.selectedItems?.find((item) => item?.id === 'delivery_fee');
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
    inEndorseLossDeliveryFeeIncluded: !!deliveryfee,
  };

  const shopLoss = cancelOrderData?.endorseLoss?.baseCurrency_shopLoss;
  const adminLoss = cancelOrderData?.endorseLoss?.baseCurrency_adminLoss;

  const totalLoss = Number(adminLoss || 0) + Number(shopLoss || 0);

  if (order?.isButler) {
    if (!cancelOrderData?.cancelReason) {
      successMsg('Select Cancel Reason type option !');
      return { status: false };
    }

    if (cancelOrderData?.cancelReason === 'others' && !cancelOrderData?.otherReason) {
      successMsg('Write other reason !');
      return { status: false };
    }

    return {
      status: true,
      data: {
        orderId: order?._id,
        logUser: 'rider', // all, rider, shop
        cancelReasonId: '',
        otherReason:
          cancelOrderData?.cancelReason === 'others' ? cancelOrderData?.otherReason : cancelOrderData?.cancelReason,
        isEndorseLoss: false, // true, false
      },
    };
  }

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

  if (cancelOrderData?.isEndorseLoss === 'true' && !cancelOrderData?.refundPercentage) {
    successMsg('Select Put cost on options!');
    return { status: false };
  }

  if (cancelOrderData?.isEndorseLoss === 'true' && !cancelOrderData?.selectedItems?.length) {
    successMsg('Select items!');
    return { status: false };
  }

  console.log(cancelOrderData?.totalSelectedAmount, totalLoss, cancelOrderData);

  if (cancelOrderData?.isEndorseLoss === 'true' && cancelOrderData?.totalSelectedAmount !== totalLoss) {
    successMsg('Total entered endorse loss not equal to total amount!');
    return { status: false };
  }

  return { status: true, data: cancelOrderTemplate };
};
