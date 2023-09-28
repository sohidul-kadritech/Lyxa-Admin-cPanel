/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { successMsg } from '../../../helpers/successMsg';
import { getRefundMaxAmounts } from '../RefundOrder/helpers';
import { calculateVat } from './Refund/helpers';

const getProductAmount = (productData) => {
  const data = [];

  productData?.forEach((item) => {
    // check it is exist or not,
    const isExist = data?.findIndex((d) => item?.productId === d?.productId);

    if (isExist >= 0) {
      data[isExist].quantity += 1;
      data[isExist].totalProductAmount = data[isExist].quantity * data[isExist].perProduct;
    } else {
      const template = {
        product: item?.productId,
        quantity: 1,
        perProduct: item?.price,
        totalProductAmount: item?.price,
        attributes: [{}],
      };
      data.push(template);
    }
  });

  return data;
};

const getReplacementOrderDeliveryInfo = (order, flaggData) => {
  const { adminExchangeRate, shop, summary, adminCharge } = order;

  const { shopExchangeRate } = shop;

  const { secondaryCurrency_riderFee, baseCurrency_riderFee } = summary;

  // rider section
  const baseriderProfit =
    flaggData?.deliveryType === 'shop-customer' ? order?.baseCurrency_riderFee : order?.baseCurrency_riderFee * 2;

  const baseriderFee = flaggData?.deliveryType === 'shop-customer' ? baseCurrency_riderFee : baseCurrency_riderFee * 2;

  const secondaryRiderFee =
    flaggData?.deliveryType === 'shop-customer' ? secondaryCurrency_riderFee : secondaryCurrency_riderFee * 2;

  const secondaryRiderProfit =
    flaggData?.deliveryType === 'shop-customer'
      ? order?.secondaryCurrency_riderFee
      : order?.secondaryCurrency_riderFee * 2;

  // admin section
  const baseCurrency_adminChargeFromDelivery =
    flaggData?.deliveryType === 'shop-customer'
      ? adminCharge?.baseCurrency_adminChargeFromDelivery
      : adminCharge?.baseCurrency_adminChargeFromDelivery * 2;

  const secondaryCurrency_adminChargeFromDelivery =
    flaggData?.deliveryType === 'shop-customer'
      ? adminCharge?.secondaryCurrency_adminChargeFromDelivery
      : adminCharge?.secondaryCurrency_adminChargeFromDelivery * 2;

  const template = {
    deliveryType: flaggData?.deliveryType, // "shop-customer" || "customer-shop-customer"
    baseCurrency_deliveryFee: baseriderFee,
    secondaryCurrency_deliveryFee: secondaryRiderFee,
    baseCurrency_riderProfit: baseriderProfit,
    secondaryCurrency_riderProfit: secondaryRiderProfit,
    baseCurrency_adminChargeFromDelivery,
    secondaryCurrency_adminDeliveryProfit: secondaryCurrency_adminChargeFromDelivery,
    baseCurrency_deliveryVat: 2,
    secondaryCurrency_deliveryVat: 20,
  };

  return template;
};

const getReplacementOrderCut = (order, flaggData) => {
  const { replacementOrderCut, selectedItems, totalSelectedAmount, deliveryfee } = flaggData;

  const {
    baseCurrency_shopCutForReplacement,
    secondaryCurrency_shopCutForReplacement,
    baseCurrency_adminCutForReplacement,
    secondaryCurrency_adminCutForReplacement,
  } = replacementOrderCut;

  let baseShop = 0;
  let secondaryShop = 0;
  let baseAdmin = 0;
  let secondaryAdmin = 0;

  if (baseCurrency_shopCutForReplacement <= deliveryfee) {
    baseShop =
      baseCurrency_shopCutForReplacement -
      baseCurrency_adminCutForReplacement +
      (deliveryfee - baseCurrency_shopCutForReplacement);
    baseAdmin = baseCurrency_adminCutForReplacement;
  } else {
    baseShop = baseCurrency_shopCutForReplacement - baseCurrency_adminCutForReplacement;
    baseAdmin = baseCurrency_adminCutForReplacement - (baseCurrency_shopCutForReplacement - deliveryfee);
  }

  const totalSecondaryCurrency =
    selectedItems?.reduce((prev, item) => prev + item?.secondaryCurrency, 0) + order?.adminExchangeRate * deliveryfee;

  const percentageOfShop = (100 / totalSelectedAmount) * Number(baseShop);

  const percentageOfAdmin = (100 / totalSelectedAmount) * Number(baseAdmin);

  secondaryShop = totalSecondaryCurrency * percentageOfShop;

  secondaryAdmin = totalSecondaryCurrency * percentageOfAdmin;

  const template = {
    baseCurrency_shopCutForReplacement: baseShop,
    secondaryCurrency_shopCutForReplacement: secondaryShop,
    baseCurrency_adminCutForReplacement: baseAdmin,
    secondaryCurrency_adminCutForReplacement: secondaryAdmin,
  };

  return { ...template };
};

const getReplacementOrderData = (order, flaggData) => {
  const template = {
    originalOrderId: order?._id,
    products: [...getProductAmount(flaggData?.selectedItems)],
    replacementOrderDeliveryInfo: getReplacementOrderDeliveryInfo(order, flaggData),
    replacementOrderCut: {
      ...getReplacementOrderCut(order, flaggData),
    },
    logUser: flaggData?.logUser, // "all" || "rider" || "shop"
    flaggedReason: flaggData?.flaggedReason, // "missing-item" || "wrong-item" || "others"
    otherReason: flaggData?.otherReason,
  };

  return { ...template };
};

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

  const baseCurrency_shopCutForReplacement = Number(
    flaggData?.replacementOrderCut?.baseCurrency_shopCutForReplacement || 0,
  );
  const baseCurrency_adminCutForReplacement = Number(
    flaggData?.replacementOrderCut?.baseCurrency_adminCutForReplacement || 0,
  );

  const totalReplacementAmount = baseCurrency_shopCutForReplacement + baseCurrency_adminCutForReplacement;

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

  if (flaggData?.replacement === 'with' && !flaggData?.deliveryType) {
    successMsg('Select delivery type option !');
    return { status: false };
  }

  console.log('totalReplacementAmount', { totalReplacementAmount, total: flaggData?.totalSelectedAmount });

  if (flaggData?.replacement === 'with' && totalReplacementAmount !== flaggData?.totalSelectedAmount) {
    successMsg('Replacement amount should be equal to total amount !');
    return { status: false };
  }

  if (flaggData?.replacement === 'with') {
    console.log('replacement order');
    return { status: true, data: { ...getReplacementOrderData(order, flaggData) } };
  }

  if (!flaggData?.refund && flaggData?.replacement === 'without') {
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
