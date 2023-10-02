import moment from 'moment';
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

export const newStatusOptions = (currentOrder) => {
  const isGlobal = currentOrder?.orderFor === 'global';

  const isPreparing = currentOrder?.orderStatus === 'preparing';

  const notAssignRider = !currentOrder?.deliveryBoy;

  const isPreparingFirst =
    !currentOrder?.accepted_delivery_boyAt && currentOrder?.preparingAt
      ? true
      : moment(currentOrder?.accepted_delivery_boyAt) > moment(currentOrder?.preparingAt);

  const shouldSwap = isGlobal && isPreparing && notAssignRider;

  const isPreparingFirstAndShouldSwap = isGlobal && isPreparingFirst;

  // preparingAt
  // accepted_delivery_boyAt

  // console.log('currentOrder', currentOrder, 'isPreparingFirst', isPreparingFirst, isPreparingFirstAndShouldSwap);

  if (shouldSwap || isPreparingFirstAndShouldSwap) {
    return {
      placed: {
        label: 'Placed',
        position: 1,
      },
      preparing: {
        label: 'Preparing',
        position: 2,
      },
      accepted_delivery_boy: {
        label: 'Assign rider',
        position: 3,
        isChangeDelivery: true,
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
  }
  return {
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
};

// eslint-disable-next-line no-unused-vars
export const paidCurrencyOptions = (isEnabled) => {
  const currencyOptions = [
    {
      label: 'Base Currency',
      value: 'baseCurrency',
    },
    {
      label: 'Secondary Currency',
      value: 'secondaryCurrency',
    },
  ];

  if (!isEnabled) {
    return currencyOptions.filter((item) => item?.value !== 'secondaryCurrency');
  }

  return currencyOptions;
};

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

  if (
    currentStatus === 'delivered' &&
    currentOrder?.paymentMethod === 'cash' &&
    !paidCurrency &&
    !currentOrder?.isReplacementOrder
  ) {
    successMsg(`Choose paid currency first`);
    return false;
  }

  return true;
};

export const updateOrderStatusOptions = (currentOrder, isReturnforAdmin = true) => {
  let list = [];

  let list2 = [];

  const newOptions = newStatusOptions(currentOrder);

  Object.entries(statusOptions)?.forEach((opt) => {
    // console.log('option', opt);
    list.push({
      label: opt[1]?.label,
      value: opt[0],
      position: opt[1]?.position,
    });
  });

  Object.entries(newOptions)?.forEach((opt) => {
    list2.push({
      label: opt[1]?.label,
      value: opt[0],
      position: opt[1]?.position,
    });
  });

  if (currentOrder?.shop?.haveOwnDeliveryBoy) {
    list = list.filter((opt) => opt.value !== 'accepted_delivery_boy');
  }

  if (currentOrder?.orderFor === 'global') {
    list = list.filter((opt) => opt.value !== 'accepted_delivery_boy');
  }

  if (currentOrder?.isButler) {
    list = list.filter((opt) => opt.value !== 'preparing' && opt.value !== 'ready_to_pickup');
    list2 = list2.filter((opt) => opt.value !== 'preparing' && opt.value !== 'ready_to_pickup');
  }

  if (isReturnforAdmin) return list2;

  // console.log(currentOrder, currentOrder?.shop?.haveOwnDeliveryBoy, 'isReturnforAdmin', list);

  return list;
  // return list;
};

export const getNextStatus = (order, isReturnforAdmin = false) => {
  const items = updateOrderStatusOptions(order, isReturnforAdmin);

  const currIdx = items?.findIndex((obj) => obj.value === order?.orderStatus);

  return items[currIdx + 1]?.value;
};
