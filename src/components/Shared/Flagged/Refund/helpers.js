/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */

import { getRefundMaxAmounts } from '../../RefundOrder/helpers';

export const logUsersOptions = [
  { value: 'all', label: 'All' },
  { value: 'rider', label: 'Rider' },
  { value: 'shop', label: 'Shop' },
];

export const TypeOptions = [
  { value: 'missing-item', label: 'Missing item' },
  { value: 'wrong-item', label: 'Wrong item' },
  { value: 'others', label: 'Others' },
];

export const cancelReasonOptions = [
  { value: 'lyxa late', label: 'Lyxa late' },
  { value: 'restaurent late', label: 'Restaurent late' },
  { value: 'user not there', label: 'User not there' },
  { value: 'others', label: 'Others' },
];

export const endorseLoseOptions = [
  { value: true, label: 'Endorse Loss' },
  { value: false, label: "Don't Endorse Loss" },
];

export const ReplacementOptions = [
  { value: 'without', label: 'Without Replacement' },
  { value: 'with', label: 'With Replacement' },
];

export const RefundOptions = [
  { value: 'without', label: 'Without Refund' },
  { value: 'with', label: 'With Refund' },
];

export const RefundTypeOptions = [
  { value: 'full', label: 'Full Refund' },
  { value: 'partial', label: 'Partial Refund' },
];

export const RefundPercentage = [
  { value: 'by_percentage', label: 'By Percentage' },
  { value: 'by_price', label: 'By Price' },
];

export const DeliveryTypeOptions = [
  { value: 'shop-customer', label: 'Restaurent / Customer' },
  { value: 'customer-shop-customer', label: 'Customer / Restaurent / Customer' },
];

export const calculateVat = (order, flaggedData, adminVat) => {
  const { partialPayment, replacementOrderCut } = flaggedData;
  const { shop, adminOrderRefund, adminDeliveryRefund } = partialPayment;

  const { baseCurrency_shopCutForReplacement, baseCurrency_adminCutForReplacement } = replacementOrderCut;

  const adminRefundAmount = Number(adminOrderRefund || 0) + Number(adminDeliveryRefund || 0);

  const { vatAmount } = order;
  const { baseCurrency_vatForAdmin, baseCurrency_vatForShop } = vatAmount;

  const totalVat = baseCurrency_vatForAdmin + baseCurrency_vatForShop;

  const vatForShop = Math.min(Number(shop || 0) * (adminVat / 100), totalVat);
  let vatForAdmin = Math.min(Number(adminRefundAmount || 0) * (adminVat / 100), totalVat);

  vatForAdmin -= Math.max(vatForShop + vatForAdmin, totalVat) - totalVat;

  const vatData = {
    vatForShop,
    vatForAdmin,
    totalVat: (vatForShop + vatForAdmin).toFixed(2),
  };

  if (flaggedData?.replacement === 'with') {
    const vatForDeliveryFee = Math.min(Number(flaggedData?.deliveryfee || 0) * (adminVat / 100), totalVat);

    const vatData = {
      vatForShop,
      vatForAdmin,
      totalVat: (vatForDeliveryFee || 0).toFixed(2),
    };

    return vatData;
  }

  return vatData;
};

// calculate percentages
const calculatePercentage = (totalSelectedAmount, value) =>
  Number((100 / totalSelectedAmount) * Number(value || 0)).toFixed(2);

// max amount for partial payment modified

export const getMaxForPartialPaymentModified = (flaggedData, order, byPercentage, key) => {
  const delivery = flaggedData?.selectedItems?.find((item) => item?.id === 'delivery_fee');

  const totalProductAmount = flaggedData?.totalSelectedAmount - delivery?.price || 0;

  const { totalSelectedAmount } = flaggedData;

  const initialMax = {
    shop: 0,
    adminOrderRefund: 0,
    adminDeliveryRefund: 0,
  };

  let percentage = {};

  if (key === 'shop') {
    /*
    total = 80;

    shop = 70

    delivery = 10;

    admin = 20
    */

    // calculating how many amount shop refund
    const shopShare = totalSelectedAmount * (Number(byPercentage?.shop || 0) / 100);
    initialMax.shop = shopShare;

    // calculating how many amount should refund from delivery refund
    initialMax.adminDeliveryRefund =
      totalSelectedAmount - shopShare >= delivery?.price
        ? delivery?.price
        : Math.max(totalSelectedAmount - shopShare, 0);

    initialMax.adminDeliveryRefund = Math.min(initialMax.adminDeliveryRefund, delivery?.price);

    // calculating how many amount should refund admin from delivery
    initialMax.adminDeliveryRefund =
      order?.orderFor !== 'specific' ? (initialMax?.adminDeliveryRefund || 0).toFixed(2) : 0;

    // calculationg exact amount for admin order refund
    const adminOrderRef = Math.max(totalSelectedAmount - shopShare - Number(initialMax.adminDeliveryRefund || 0), 0);
    initialMax.adminOrderRefund = adminOrderRef.toFixed(2);

    initialMax.adminOrderRefund = Number(Number(initialMax?.adminOrderRefund || 0).toFixed(2));
    initialMax.adminDeliveryRefund = Number(Number(initialMax?.adminDeliveryRefund || 0).toFixed(2));
    initialMax.shop = Number(Number(initialMax?.shop || 0).toFixed(2));

    // calculating exact percentages of all the amount
    percentage = {
      shop: calculatePercentage(totalSelectedAmount, initialMax?.shop),
      adminOrderRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminOrderRefund),
      adminDeliveryRefund:
        order?.orderFor !== 'specific' ? calculatePercentage(totalSelectedAmount, initialMax?.adminDeliveryRefund) : 0,
    };

    return {
      initialMax,
      percentage,
    };
  }

  if (key === 'adminDeliveryRefund') {
    /*
    total = 80;

    shop = 40

    delivery = 5;

    admin = 35
    */
    const deliveryShare = totalSelectedAmount * (Number(byPercentage?.adminDeliveryRefund || 0) / 100);

    // 8
    initialMax.adminDeliveryRefund = Math.min(deliveryShare, delivery?.price || 0).toFixed(2);

    // 80-40-5 =
    const adminOrderRef = Math.max(
      totalSelectedAmount -
        Number(flaggedData?.partialPayment?.shop || 0) -
        Number(initialMax.adminDeliveryRefund || 0),
      0,
    );

    // 0 < 90
    initialMax.adminOrderRefund =
      Number(flaggedData?.partialPayment?.adminOrderRefund) < totalProductAmount
        ? adminOrderRef
        : Number(flaggedData?.partialPayment?.adminOrderRefund || 0);

    // 80-70-5=5
    initialMax.shop = Math.max(
      totalSelectedAmount - Number(initialMax.adminOrderRefund || 0) - Number(initialMax.adminDeliveryRefund || 0),
      0,
    );

    percentage = {
      shop: calculatePercentage(totalSelectedAmount, initialMax?.shop),
      adminOrderRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminOrderRefund),
      adminDeliveryRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminDeliveryRefund),
    };

    initialMax.adminOrderRefund = Number(Number(initialMax?.adminOrderRefund || 0).toFixed(2));
    initialMax.adminDeliveryRefund = Number(Number(initialMax?.adminDeliveryRefund || 0).toFixed(2));
    initialMax.shop = Number(Number(initialMax?.shop || 0).toFixed(2));

    return {
      initialMax,
      percentage,
    };
  }

  return {
    initialMax,
    percentage,
  };
};

// max amount for partial payment
export const getMaxForPartialPayment = (flaggedData, order, byPercentage, key) => {
  const delivery = flaggedData?.selectedItems?.find((item) => item?.id === 'delivery_fee');

  const totalProductAmount = flaggedData?.selectedItems
    ?.filter((item) => item?.id !== 'delivery_fee')
    .reduce((prev, item) => prev + item?.price, 0);

  const { totalSelectedAmount } = flaggedData;

  const initialMax = {
    shop: 0,
    adminOrderRefund: 0,
    adminDeliveryRefund: 0,
  };

  let percentage = {};

  const shopShare = totalSelectedAmount * (Number(byPercentage?.shop || 0) / 100);
  initialMax.shop = shopShare;

  const diffShopShareTP =
    (order?.orderFor !== 'specific' ? totalProductAmount : totalProductAmount + delivery?.price || 0) - shopShare;

  initialMax.adminDeliveryRefund = delivery?.price || 0;
  initialMax.adminDeliveryRefund =
    order?.orderFor !== 'specific' ? (initialMax?.adminDeliveryRefund || 0).toFixed(2) : 0;
  initialMax.adminOrderRefund = (diffShopShareTP || 0).toFixed(2);

  if (shopShare >= totalProductAmount) {
    initialMax.adminDeliveryRefund =
      diffShopShareTP < 0 ? delivery?.price || 0 - Math.abs(diffShopShareTP) : delivery?.price || 0;
    initialMax.adminDeliveryRefund =
      order?.orderFor !== 'specific' ? (totalSelectedAmount - shopShare || 0).toFixed(2) : 0;
    initialMax.adminOrderRefund = 0;
  }

  percentage = {
    shop: calculatePercentage(totalSelectedAmount, initialMax?.shop),
    adminOrderRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminOrderRefund),
    adminDeliveryRefund:
      order?.orderFor !== 'specific' ? calculatePercentage(totalSelectedAmount, initialMax?.adminDeliveryRefund) : 0,
  };

  if (key === 'adminDeliveryRefund') {
    const deliveryShare = totalSelectedAmount * (Number(byPercentage?.adminDeliveryRefund || 0) / 100);

    const remainingDeliveryFee = Math.max(delivery?.price || 0 - deliveryShare, 0);

    const remainingPercentage = 100 - Number(byPercentage?.adminDeliveryRefund || 0);

    initialMax.adminDeliveryRefund = Math.min(deliveryShare, delivery?.price || 0).toFixed(2);

    initialMax.adminOrderRefund = (
      (totalSelectedAmount * (remainingPercentage / 2)) / 100 -
      remainingDeliveryFee
    ).toFixed(2);

    initialMax.shop = ((totalSelectedAmount * (remainingPercentage / 2)) / 100 + remainingDeliveryFee).toFixed(2);

    percentage = {
      shop: calculatePercentage(totalSelectedAmount, initialMax?.shop),
      adminOrderRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminOrderRefund),
      adminDeliveryRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminDeliveryRefund),
    };

    return {
      initialMax,
      percentage,
    };
  }

  return { initialMax, percentage };
};

// get max limit
export const getMaxLimit = (flaggData, order, by_percentage = true) => {
  const delivery = flaggData?.selectedItems?.find((item) => item?.id === 'delivery_fee');
  const initialMax = {
    shop: 100,
    adminOrderRefund: 0,
    adminDeliveryRefund: calculatePercentage(flaggData?.totalSelectedAmount, delivery?.price || 0),
  };

  if (!by_percentage && flaggData?.replacement !== 'with') {
    initialMax.shop = flaggData?.totalSelectedAmount;
    initialMax.adminDeliveryRefund = delivery?.price;
    return initialMax;
  }

  if (by_percentage && flaggData?.replacement === 'with' && flaggData?.flaggedReason !== 'missing-item') {
    initialMax.shop = Number(((100 / flaggData?.totalSelectedAmount) * flaggData?.deliveryfee).toFixed(3));
    initialMax.adminDeliveryRefund = delivery?.price;
    return initialMax;
  }

  return initialMax;
};

// max partial payment by price
export const getMaxForPartialPaymentByPrice = (flaggedData, order, key) => {
  const delivery = flaggedData?.selectedItems?.find(
    (item) => item?.id === 'delivery_fee' && order?.orderFor !== 'specific',
  );

  // const totalProductAmount = flaggedData?.selectedItems
  //   ?.filter((item) => item?.id !== 'delivery_fee')
  //   .reduce((prev, item) => prev + item?.price, 0);

  const totalProductAmount = flaggedData?.totalSelectedAmount - delivery?.price || 0;

  const { totalSelectedAmount, partialPayment } = flaggedData;

  const initialMax = {
    shop: 0,
    adminOrderRefund: 0,
    adminDeliveryRefund: 0,
  };

  if (key === 'shop') {
    let remaining = totalSelectedAmount - Number(partialPayment?.shop || 0);

    initialMax.shop = Number(partialPayment?.shop || 0);

    initialMax.adminDeliveryRefund = remaining > 0 ? Math.min(remaining, delivery?.price || 0) : 0;

    remaining -= initialMax.adminDeliveryRefund;

    initialMax.adminOrderRefund = Math.max(remaining, 0);

    return initialMax;
  }

  if (key === 'adminDeliveryRefund') {
    initialMax.adminDeliveryRefund = Math.min(partialPayment?.adminDeliveryRefund, delivery?.price || 0).toFixed(2);
    // initialMax.adminDeliveryRefund = Math.min(Number(partialPayment?.adminDeliveryRefund || 0), delivery?.price);
    const adminOrderRef = Math.max(
      totalSelectedAmount - Number(partialPayment?.shop || 0) - Number(initialMax.adminDeliveryRefund || 0),
      0,
    );

    // 0 < 90
    initialMax.adminOrderRefund =
      Number(partialPayment?.adminOrderRefund) < totalProductAmount
        ? adminOrderRef
        : Number(partialPayment?.adminOrderRefund || 0);

    // initialMax.adminOrderRefund = Math.max(Number(partialPayment?.adminOrderRefund || 0), 0);

    // initialMax.shop = Math.max(Number(remaining || 0), 0);
    initialMax.shop = Math.max(
      totalSelectedAmount - Number(initialMax.adminOrderRefund || 0) - Number(initialMax.adminDeliveryRefund || 0),
      0,
    );

    return initialMax;
  }

  return initialMax;
};

// get max for replacement order for price
const getMaxForReplacementOrderForPrice = (flaggData, byPrice) => {
  const initialMax = {
    shop: 100,
    adminOrderRefund: 100,
  };

  return initialMax;
};

// calculating total vat with refund

export const getTotalRefundAmountWithVat = (order, flaggedData, totalVat) => {
  const { partialPayment } = flaggedData;
  const { shop, adminOrderRefund, adminDeliveryRefund } = partialPayment;

  const totalAmount =
    Number(shop || 0) + Number(adminDeliveryRefund || 0) + Number(adminOrderRefund || 0) + Number(totalVat || 0);

  if (flaggedData?.refund === 'with' && flaggedData?.refundType === 'full') {
    const getMaxForPartialPayment = getRefundMaxAmounts(order);
    const { shop, adminOrderRefund, adminDeliveryRefund, adminVat } = getMaxForPartialPayment;
    const totalAmount =
      Number(shop || 0) + Number(adminDeliveryRefund || 0) + Number(adminOrderRefund || 0) + Number(adminVat || 0);
    return totalAmount.toFixed(2);
  }

  return totalAmount.toFixed(2);
};

export const getInitialValue = (targetName) => {
  const templateForPartialPaymentAndReplacementOrder = {
    replacementOrderCut: {
      baseCurrency_shopCutForReplacement: '',
      secondaryCurrency_shopCutForReplacement: '',
      baseCurrency_adminCutForReplacement: '',
      secondaryCurrency_adminCutForReplacement: '',
    },
    partialPayment: {
      shop: '',
      adminOrderRefund: '',
      adminDeliveryRefund: '',
      adminVat: '',
    },
  };

  const initialValue = {
    refund: {
      ...templateForPartialPaymentAndReplacementOrder,
      refundType: '',
      refundPercentage: '',
      selectedItems: [],
    },
    replacement: {
      ...templateForPartialPaymentAndReplacementOrder,
      refundType: '',
      refundPercentage: '',
      refund: '',
      selectedItems: [],
    },
    refundType: { ...templateForPartialPaymentAndReplacementOrder, refundPercentage: '', selectedItems: [] },
    deliveryType: { ...templateForPartialPaymentAndReplacementOrder, refundPercentage: '', selectedItems: [] },
    refundPercentage: {},
  };

  return initialValue[targetName] ? initialValue[targetName] : {};
};

export const getProductPrice = (product, deal) => {
  console.log({ product });
  if (deal === 'double_menu') {
    return (product?.baseCurrency_productPrice - product?.baseCurrency_discount) * 2 || 0;
  }

  if (deal === 'reward') {
    return product?.finalReward?.baseCurrency_amount || 0;
  }
  if (deal === 'percentage') {
    return product?.baseCurrency_productPrice - product?.baseCurrency_discount || 0;
  }

  return product?.baseCurrency_productPrice;
};

// adjust total amount when coupon applied

export const getMaximumAdjustableAmount = (order, value) => {
  const { baseCurrency_card, baseCurrency_cash, baseCurrency_wallet, baseCurrency_vat } = order?.summary;

  const totalAmount = baseCurrency_card + baseCurrency_cash + baseCurrency_wallet - baseCurrency_vat;

  const inputValue = Number(value || 0);

  const result = Math.min(totalAmount, inputValue);

  return Math.max(result, 0) === 0 ? '' : Math.max(result, 0);
};
