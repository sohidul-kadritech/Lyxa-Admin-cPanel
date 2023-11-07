/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable prettier/prettier */

const calculateTotal = () => {
  let total = totalBill(addedItems) - getRewordItem()?.amount;

  if (groupCartInfo?.cartType == 'group') {
    if (groupCartInfo?.paymentPreferences == 'pay_for_themselves') {
      total = totalBill(addedItems, user) - getRewordItem(user)?.amount;
    }

    if (groupCartInfo?.deliveryFeePreferences == 'equally') {
      total += deliveryCharge?.deliveryFee / totalMember;
    } else {
      total += deliveryCharge?.deliveryFee;
    }
  } else {
    total += deliveryCharge?.deliveryFee;
  }
  // console.log(total);
  // vat calculation
  const temp = totalBill(addedItems) + deliveryCharge?.deliveryFee - getRewordItem()?.amount;

  // console.log(temp);

  total += (deliveryCharge?.vat / temp) * total;
  return total - coupon?.discountAmount + riderTip;
};

const cartIntent = () => {
  const total = calculateTotal();

  if (toggle) {
    if (total > credits?.balance) {
      return Math.round((total - credits?.balance) * 100) / 100;
    }
    return 0;
  }
  return total;
};

const getTime = () => {
  if (addedItems?.length > 0) {
    return distance(addedItems[0]?.shop?.location?.coordinates, lonLat);
  }
};

const getRewordItem = (user) => {
  let totalReward = 0;
  let rewordPrice = 0;

  addedItems?.map((item) => {
    if (
      (user ? item?.owner?._id == user?._id : true) &&
      item?.marketing[0]?.isActive &&
      item?.marketing[0]?.type == 'reward' &&
      item.rewardApplied
    ) {
      totalReward += item?.reward?.points * item?.quantity;
      rewordPrice += item?.price * item?.quantity;
      rewordPrice -= item?.reward?.amount * item?.quantity;
    }
  });

  return {
    points: totalReward,
    amount: rewordPrice,
    baseCurrency_amount: rewordPrice,
    secondaryCurrency_amount: rewordPrice * shopExchangeRate,
  };
};

const checkPoints = (totalAmount) => {
  const check = totalAmount - getRewordItem()?.amount <= credits?.balance;

  return check;
};

const createOrderJson = () => {
  const totalAmount = totalBill(addedItems) + deliveryCharge?.deliveryFee + deliveryCharge?.vat;

  const totalDiscount = calculatePrice(addedItems) - totalBill(addedItems);

  const products = [];

  userWiseDoubleDealManipulate(addedItems)?.map((item) => {
    const productsItem = {};
    productsItem.product = item._id;
    productsItem.quantity = item?.quantity;

    //  check any mearketing
    if (item?.marketing?.isActive) {
      if (item?.marketing?.type == 'reward' && item.rewardApplied) {
        productsItem.reward = item.reward;
        productsItem.marketingId = item?.marketing?._id;
      } else if (item?.marketing?.type !== 'reward') {
        productsItem.marketingId = item?.marketing?._id;
      }
    }

    // check double deal
    if (item?.marketing?.isActive && item?.marketing?.type == 'double_menu') {
      productsItem.isDoubleDeal = true;
    }

    productsItem.perProduct = SingleItemcalculatePrice(item) / item.quantity;
    productsItem.totalProductAmount = SingleItemcalculatePrice(item);

    // check discount
    if (item?.marketing?.isActive && item?.marketing?.type == 'percentage') {
      productsItem.discount = item?.price - item?.discountPrice;

      productsItem.totalDiscount = (item?.price - item?.discountPrice) * item.quantity;
    } else if (item?.marketing?.isActive && item?.marketing?.type == 'double_menu') {
      productsItem.totalDiscount =
        item?.price * item?.quantity - item?.price * (item?.quantity - item?.discountQuantity);

      productsItem.discount = productsItem.totalDiscount / item?.quantity;
    } else {
      productsItem.discount = 0;
      productsItem.totalDiscount = 0;
    }

    // special instruction

    productsItem.productSpecialInstruction = item?.productSpecialInstruction;
    // // ==========
    const attributes = [];

    item?.attributes?.map((child) => {
      const attributesItem = {};
      const subId = [];
      child?.items?.map((subChild) => {
        if (item?.selectedAttributes?.includes(subChild?._id)) {
          subId.push({ id: subChild?._id, extraPrice: subChild?.extraPrice });
        }
      });
      if (subId.length > 0) {
        attributesItem.id = child?._id;
        attributesItem.attributeItems = subId;
        attributes.push(attributesItem);
      }
    });

    productsItem.attributes = attributes;

    productsItem.owner = item?.owner?._id;

    products.push(productsItem);
  });

  const getAmount = () => {
    const total = totalAmount - getRewordItem()?.amount - coupon?.discountAmount + riderTip;

    if (total > credits?.balance) {
      return total - credits?.balance;
    }
    return 0;
  };

  const getCash = () => {
    if (paymentType == 1) {
      if (toggle) {
        return getAmount();
      }
      return totalAmount - getRewordItem()?.amount - coupon?.discountAmount;
    }
    return 0;
  };

  const calculationForIndividualPayCart = () => {
    let count = 0;
    groupCartInfo?.cartItems?.map((item) => {
      const summary = item?.summary;
      if (summary) {
        count += summary?.baseCurrency_card;
      }
    });
    return count + creatorGetCard();
  };

  const getCard = () => {
    if (groupCartInfo?.paymentPreferences == 'pay_for_themselves') {
      return calculationForIndividualPayCart();
    }

    const total = totalAmount - getRewordItem()?.amount - coupon?.discountAmount + riderTip;

    if (paymentType == 3) {
      if (toggle) {
        return getAmount();
      }
      return total;
    }
    return 0;
  };

  const calculationForIndividualPayWallet = () => {
    let count = 0;
    groupCartInfo?.cartItems?.map((item) => {
      const summary = item?.summary;
      if (summary) {
        count += summary?.baseCurrency_wallet;
      }
    });
    return count + creatorGetWallet();
  };

  const getWallet = () => {
    if (groupCartInfo?.paymentPreferences == 'pay_for_themselves') {
      return calculationForIndividualPayWallet();
    }

    const total = totalAmount - getRewordItem()?.amount - coupon?.discountAmount + riderTip;

    if (toggle) {
      if (total > credits?.balance) {
        return credits?.balance;
      }
      return total;
    }
    return 0;
  };

  const creatorProductAmountRegular = totalBill(addedItems, user, false, true);
  const creatorProductAmountDiscount = totalBill(addedItems, user);

  const creatorDiscountPrice = creatorProductAmountRegular - creatorProductAmountDiscount;

  const getDeliveryCharge = () => deliveryCharge?.deliveryFee;

  const vatCalculation = () => {
    const redeemReword = getRewordItem(user)?.amount;
    let creatorIndividualBill = 0;

    if (groupCartInfo?.paymentPreferences == 'pay_for_themselves') {
      creatorIndividualBill = totalBill(addedItems, user);
    } else {
      creatorIndividualBill = totalBill(addedItems);
    }

    const result = (deliveryCharge?.vat / totalPrice) * (creatorIndividualBill - redeemReword + getDeliveryCharge());

    return result;
  };

  const creatorGetCash = () => {
    if (paymentType == 1) {
      return cartIntent();
    }
    return 0;
  };

  let creatorGetCard = () => {
    if (paymentType == 3) {
      return cartIntent();
    }
    return 0;
  };

  let creatorGetWallet = () => {
    if (!toggle) {
      return 0;
    }
    const total = calculateTotal();
    if (total >= credits?.balance) {
      return credits?.balance;
    }
    return total;
  };

  // console.log(creatorGetCard());

  const dualCurrencyRatio = secondaryFinalPrice / finalPrice;

  const data = {
    shopId,
    type: schedule?.status === 'now' ? 'now' : 'schedule',
    scheduleDate: schedule?.date,
    orderType: addedItems[0]?.type,
    paymentMethod: paymentType === 1 ? 'cash' : paymentType === 2 ? 'applePay' : 'card',
    pos: pos ? 'yes' : 'no',
    orderDeliveryAddressId: address?._id,
    products: [...products],
    deliveryBoyNote: riderNotes,
    note: orderNotes,
    order_delivery_charge_id: deliveryCharge?._id,
    specialInstruction,
    summary: {
      baseCurrency_productAmount:
        (Math.round(totalAmount - getDeliveryCharge() - deliveryCharge?.vat + totalDiscount) * 100) / 100,
      baseCurrency_riderFee: getDeliveryCharge(),
      baseCurrency_totalAmount: totalAmount - deliveryCharge?.vat + totalDiscount,
      baseCurrency_discount: totalDiscount,
      baseCurrency_vat: deliveryCharge?.vat,
      baseCurrency_cash: getCash(),
      secondaryCurrency_cash: Math.round(getCash() * dualCurrencyRatio),
      baseCurrency_card: getCard(),
      secondaryCurrency_card: Math.round(getCard() * dualCurrencyRatio),
      baseCurrency_wallet: getWallet(),
      secondaryCurrency_wallet: Math.round(getWallet() * dualCurrencyRatio),
      reward: getRewordItem(),
      baseCurrency_doubleMenuItemPrice: doubleMenuItemPriceCalculation(addedItems),
      baseCurrency_riderTip: riderTip,
      baseCurrency_couponDiscountAmount: coupon?.discountAmount,
    },
  };

  if (coupon?.discountAmount) {
    data.couponId = coupon?.coupon?._id;
  }

  if (bringChangeToggle && bringChange) {
    data.bringChangeAmount = bringChange;
  }

  return data;
};

const finalPrice =
  totalBill(addedItems) +
  deliveryCharge?.deliveryFee +
  deliveryCharge?.vat +
  riderTip -
  getRewordItem()?.amount -
  coupon?.discountAmount;

const secondaryFinalPrice = convertSecondCurrencyTotalPrice(
  totalBill(addedItems),
  deliveryCharge?.deliveryFee,
  deliveryCharge?.vat,
  riderTip,
  getRewordItem()?.amount,
  coupon?.discountAmount,
  shopExchangeRate,
  adminExchangeRate,
  shop?.haveOwnDeliveryBoy,
);

const totalBill = (addedItems, user, skipDiscount, skipPercentage) => {
  let count = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;

    if (
      itemData?.marketing?.isActive &&
      itemData?.marketing?.type == 'percentage' &&
      !skipDiscount &&
      !skipPercentage
    ) {
      price = itemData?.discountPrice * (itemData?.quantity || itemData?.productQuantity);
    } else if (itemData?.marketing?.isActive && itemData?.marketing?.type == 'double_menu' && !skipDiscount) {
      if (!array.includes(itemData?.productId)) {
        const doubleDealAllProduct = addedItems?.filter(
          (item) => item?.productId == itemData?.productId && (user ? item?.owner?._id == user?._id : true),
        );

        let quantity = 0;
        doubleDealAllProduct?.map((item) => {
          quantity += itemData?.quantity || itemData?.productQuantity;
        });

        price += itemData?.price * (parseInt(quantity / 2) + (quantity % 2));
        array.push(itemData?._id);
      }
    } else {
      price = itemData?.price * (itemData?.quantity || itemData?.productQuantity);
    }
    // console.log(count);
    count += price;

    itemData?.attributes?.map((parent) => {
      parent?.items?.map((child) => {
        if (itemData?.selectedAttributes?.includes(child?._id)) {
          count += child?.extraPrice * (itemData?.quantity || itemData?.productQuantity);
        }
      });
    });
  });

  return Math.round(count * 100) / 100;
};

const calculatePrice = (addedItems) => {
  let count = 0;
  const array = [];
  addedItems?.map((itemData) => {
    if (itemData?.marketing?.isActive && itemData?.marketing?.type == 'double_menu') {
      if (!array.includes(itemData?._id)) {
        const doubleDealAllProduct = addedItems?.filter((item) => item?._id == itemData?._id);
        let quantity = 0;
        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity;
        });

        count += itemData?.price * (parseInt(quantity / 2) + (quantity % 2));
        array.push(itemData?._id);
      }
    } else {
      count += itemData?.price * itemData.quantity;
    }

    itemData?.attributes?.map((parent) => {
      parent?.items?.map((child) => {
        if (itemData?.selectedAttributes?.includes(child?._id)) {
          count += (child?.price ? child?.price : child?.extraPrice) * itemData?.quantity;
        }
      });
    });
  });
  // console.log(count);

  return Math.round(count * 100) / 100;
};

const doubleMenuItemPriceCalculation = (addedItems, user) => {
  let count = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;
    if (itemData?.marketing?.isActive && itemData?.marketing?.type == 'double_menu') {
      if (!array.includes(itemData?._id)) {
        const doubleDealAllProduct = addedItems?.filter(
          (item) => item?._id == itemData?._id && (!user || item?.owner?._id == user?._id),
        );

        let quantity = 0;

        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity;
        });

        price += itemData?.price * parseInt(quantity / 2);
        array.push(itemData?._id);
      }
    }
    // console.log(count);
    count += price;
  });

  return Math.round(count * 100) / 100;
};

const SingleItemcalculatePrice = (itemData) => {
  // console.log(itemData);
  let count = 0;

  const { quantity } = itemData;

  count = itemData?.price * quantity;

  itemData?.attributes?.map((parent) => {
    parent?.items?.map((child) => {
      if (itemData?.selectedAttributes?.includes(child?._id)) {
        count += child?.extraPrice * itemData?.quantity;
      }
    });
  });

  // console.log(count);

  return Math.round(count * 100) / 100;
};

export default NewCheckOut;

const styles = StyleSheet.create({
  container: (darkMode) => ({
    flex: 1,
    backgroundColor: darkMode ? DARK_BACKGROUND_COLOR : BACKGROUND_COLOR,
  }),
  topHeader: (darkMode, status) => ({
    flex: 0,
    backgroundColor: status ? 'rgba(0,0,0,.3)' : darkMode ? DARK_BACKGROUND_COLOR : BACKGROUND_COLOR,
  }),
  bottomHeader: (darkMode) => ({
    flex: 0,
    backgroundColor: darkMode ? DARK_BACKGROUND_COLOR : BACKGROUND_COLOR,
  }),
});

export const initialAdjustmentOrderData = {
  orderId: '',
  products: [
    {
      product: '6352c0966ceeee30b3e5fba9',
      perProduct: 100,
      discount: 0,
      totalProductAmount: 100,
      totalDiscount: 0,
      quantity: 1,
      attributes: [
        {
          id: '5f9f1b1b1b1b1b1b1b1b1b1b',
          attributeItems: [
            {
              id: '5f9f1b1b1b1b1b1b1b1b1b1b',
              extraPrice: '20',
            },
          ],
        },
      ],
      isDoubleDeal: true,
      productSpecialInstruction: '',
      reward: {
        amount: 10,
        points: 10,
      },
      marketingId: '6352c0966ceeee30b3e5fba9',
      owner: '6352c0966ceeee30b3e5fba9',
    },
  ],
  summary: {
    baseCurrency_productAmount: 10,
    baseCurrency_riderFee: 10,
    baseCurrency_totalAmount: 20,
    baseCurrency_discount: 5,
    baseCurrency_vat: 5,
    baseCurrency_wallet: 0,
    secondaryCurrency_wallet: 0,
    baseCurrency_card: 0,
    secondaryCurrency_card: 0,
    baseCurrency_cash: 10,
    secondaryCurrency_cash: 20,
    reward: {
      points: 0,
      baseCurrency_amount: 0,
    },
    baseCurrency_doubleMenuItemPrice: 50,
    baseCurrency_riderTip: 20,
    baseCurrency_couponDiscountAmount: 20,
  },
  adjustmentReason: '',
};
