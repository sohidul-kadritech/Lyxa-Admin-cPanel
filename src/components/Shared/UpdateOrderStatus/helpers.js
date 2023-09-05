import { successMsg } from '../../../helpers/successMsg';

export const statusOptions = {
  placed: {
    label: 'Placed',
    position: 1,
  },
  accepted_delivery_boy: {
    label: 'Assign rider',
    position: 2,
    isChangeDelivery: true,
  },
  preparing: {
    label: 'Preparing',
    position: 3,
  },
  ready_to_pickup: {
    label: 'Ready for pickup',
    position: 4,
  },
  order_on_the_way: {
    label: 'On the way',
    position: 5,
  },
  delivered: {
    label: 'Delivered',
    position: 6,
  },
};

export const paidCurrencyOptions = [
  {
    label: 'Base Currency',
    value: 'baseCurrency',
  },
  {
    label: 'Secondary Currency',
    value: 'secondaryCurrency',
  },
];

export const validate = (currentStatus, currentOrderDelivery, currentOrder, paidCurrency) => {
  if (currentStatus === '') {
    successMsg('Please select status');
    return false;
  }

  if (currentStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
    successMsg('Please select rider');
    return false;
  }

  if (
    (currentStatus === 'delivered' || currentStatus === 'preparing') &&
    !currentOrderDelivery?._id &&
    !currentOrder?.shop?.haveOwnDeliveryBoy
  ) {
    successMsg(`Assign rider first`);
    return false;
  }

  if (currentStatus === 'preparing' && !currentOrderDelivery) {
    successMsg(`Assign rider first`);
    return false;
  }

  if (currentStatus === 'delivered' && currentOrder?.paymentMethod === 'cash' && !paidCurrency) {
    successMsg(`Choose paid currency first`);
    return false;
  }

  return true;
};

export const updateOrderStatusOptions = (currentOrder) => {
  let list = [];

  Object.entries(statusOptions)?.forEach((opt) => {
    list.push({
      label: opt[1]?.label,
      value: opt[0],
      position: opt[1]?.position,
    });
  });

  if (currentOrder?.shop?.haveOwnDeliveryBoy) {
    list = list.filter((opt) => opt.value !== 'accepted_delivery_boy');
  }

  if (currentOrder?.isButler) {
    list = list.filter((opt) => opt.value !== 'preparing' && opt.value !== 'ready_to_pickup');
  }

  return list;
};

export const getNextStatus = (order) => {
  const items = updateOrderStatusOptions(order);
  const currIdx = items?.findIndex((obj) => obj.value === order?.orderStatus);
  return items[currIdx + 1]?.value;
};
