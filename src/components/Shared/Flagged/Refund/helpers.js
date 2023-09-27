/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
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
  { value: 'restaurent_customer', label: 'Restaurent / Customer' },
  { value: 'customer_restaurent_customer', label: 'Customer / Restaurent / Customer' },
];

export const calculateVat = (order, flaggedData, adminVat) => {
  const { partialPayment } = flaggedData;
  const { shop, adminOrderRefund, adminDeliveryRefund } = partialPayment;

  const adminRefundAmount = Number(adminOrderRefund || 0) + Number(adminDeliveryRefund || 0);

  const { vatAmount } = order;
  const { baseCurrency_vatForAdmin, baseCurrency_vatForShop } = vatAmount;

  const totalVat = baseCurrency_vatForAdmin + baseCurrency_vatForShop;

  const vatForShop = Math.min(Number(shop || 0) * (adminVat / 100), totalVat);
  const vatForAdmin = Math.min(Number(adminRefundAmount || 0) * (adminVat / 100), totalVat);

  const vatData = {
    vatForShop,
    vatForAdmin,
    totalVat: (vatForShop + vatForAdmin).toFixed(2),
  };

  return vatData;
};

const calculatePercentage = (totalSelectedAmount, value) => Number((100 / totalSelectedAmount) * value || 0).toFixed(2);

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

  const diffShopShareTP = totalProductAmount - shopShare;

  initialMax.adminDeliveryRefund = delivery?.price;
  initialMax.adminDeliveryRefund = (initialMax?.adminDeliveryRefund || 0).toFixed(2);
  initialMax.adminOrderRefund = (diffShopShareTP || 0).toFixed(2);

  if (shopShare >= totalProductAmount) {
    initialMax.adminDeliveryRefund =
      diffShopShareTP < 0 ? delivery?.price - Math.abs(diffShopShareTP) : delivery?.price;
    initialMax.adminDeliveryRefund = (initialMax?.adminDeliveryRefund || 0).toFixed(2);
    initialMax.adminOrderRefund = 0;
  }

  percentage = {
    shop: calculatePercentage(totalSelectedAmount, initialMax?.shop),
    adminOrderRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminOrderRefund),
    adminDeliveryRefund: calculatePercentage(totalSelectedAmount, initialMax?.adminDeliveryRefund),
  };

  if (key === 'adminDeliveryRefund') {
    const deliveryShare = totalSelectedAmount * (Number(byPercentage?.adminDeliveryRefund || 0) / 100);

    const remainingDeliveryFee = Math.max(delivery?.price - deliveryShare, 0);

    const remainingPercentage = 100 - Number(byPercentage?.adminDeliveryRefund || 0);

    initialMax.adminDeliveryRefund = Math.min(deliveryShare, delivery?.price).toFixed(2);

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

export const getMaxLimit = (flaggData, order, by_percentage = true) => {
  const delivery = flaggData?.selectedItems?.find((item) => item?.id === 'delivery_fee');
  const initialMax = {
    shop: 100,
    adminOrderRefund: 0,
    adminDeliveryRefund: calculatePercentage(flaggData?.totalSelectedAmount, delivery?.price),
  };
  if (!by_percentage) {
    initialMax.shop = flaggData?.totalSelectedAmount;
    initialMax.adminDeliveryRefund = delivery?.price;
    return initialMax;
  }

  return initialMax;
};

export const getMaxForPartialPaymentByPrice = (flaggedData, order, key) => {
  const delivery = flaggedData?.selectedItems?.find((item) => item?.id === 'delivery_fee');

  const totalProductAmount = flaggedData?.selectedItems
    ?.filter((item) => item?.id !== 'delivery_fee')
    .reduce((prev, item) => prev + item?.price, 0);

  const { totalSelectedAmount, partialPayment } = flaggedData;

  const initialMax = {
    shop: 0,
    adminOrderRefund: 0,
    adminDeliveryRefund: 0,
  };

  if (key === 'shop') {
    let remaining = totalSelectedAmount - Number(partialPayment?.shop || 0);

    initialMax.shop = Number(partialPayment?.shop || 0);

    initialMax.adminDeliveryRefund = remaining > 0 ? Math.min(remaining, delivery?.price) : 0;

    remaining -= initialMax.adminDeliveryRefund;

    initialMax.adminOrderRefund = Math.max(remaining, 0);

    return initialMax;
  }

  if (key === 'adminDeliveryRefund') {
    const remaining =
      totalSelectedAmount - Number(partialPayment?.adminDeliveryRefund || 0) - Number(partialPayment?.adminOrderRefund);

    initialMax.adminDeliveryRefund = Math.min(Number(partialPayment?.adminDeliveryRefund || 0), delivery?.price);

    initialMax.adminOrderRefund = Math.max(Number(partialPayment?.adminOrderRefund || 0), 0);

    initialMax.shop = Math.max(Number(remaining || 0), 0);

    return initialMax;
  }

  return initialMax;
};
