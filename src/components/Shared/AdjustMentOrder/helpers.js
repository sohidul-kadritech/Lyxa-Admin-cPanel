/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */

import { successMsg } from '../../../helpers/successMsg';

/* eslint-disable no-unsafe-optional-chaining */
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

const calculatetotalDiscountPrice = (addedItems) => {
  let count = 0;

  addedItems?.map((itemData) => {
    if (itemData?.marketing?.isActive && itemData?.marketing?.type === 'percentage') {
      count += itemData?.baseCurrency_discount;
    }
  });
  // console.log(count);

  return Math.round(count * 100) / 100;
};

export const productDealForProductDetails = (product) => {
  const isActive = product?.marketing?.isActive === true;
  const type = product?.marketing?.type;

  if (isActive) {
    return type;
  }

  return null;
};

// calculate product price for adjustment order
export const getProductPriceForAdjustMent = (product, deal) => {
  if (deal === 'double_menu') {
    return { finalPrice: product?.price, originalPrice: product?.price, shouldShowBoth: true };
  }

  if (deal === 'reward') {
    return { finalPrice: product?.price, originalPrice: product?.price, shouldShowBoth: false };
  }
  if (deal === 'percentage') {
    return { finalPrice: product?.price - product?.discount, originalPrice: product?.price, shouldShowBoth: true };
  }

  return { finalPrice: product?.price, originalPrice: product?.price, shouldShowBoth: false };
};

// total product bill
const totalBill = (addedItems, user, skipDiscount, skipPercentage) => {
  let count = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;

    if (itemData?.marketing?.type !== 'double_menu') {
      price = itemData?.product?.price * (itemData?.quantity || itemData?.productQuantity);
      count += price;

      itemData?.selectedAttributes?.map((parent) => {
        parent?.attributeItems?.map((child) => {
          count += child?.extraPrice * (itemData?.quantity || itemData?.productQuantity);
          price += child?.extraPrice * (itemData?.quantity || itemData?.productQuantity);
        });
      });
    }
  });

  return Math.round(count * 100) / 100;
};

export const calculatePrice = (item, skipDiscount, discountQuantity = 0, shopExchangeRate = 0) => {
  let count = 0;
  let singlePrice = 0;

  const getSecondaryCurrency = (value) => Math.round(shopExchangeRate * value);

  const output = {
    baseCurrency_finalPrice: 0,
    baseCurrency_totalDiscount: 0,
    baseCurrency_discount: 0,
    baseCurrency_productPrice: 0,

    secondaryCurrency_finalPrice: 0,
    secondaryCurrency_totalDiscount: 0,
    secondaryCurrency_discount: 0,
    secondaryCurrency_productPrice: 0,
    finalReward: {
      points: 0,
      baseCurrency_amount: 0,
      secondaryCurrency_amount: 0,
    },
  };

  if (item?.marketing?.isActive && item?.marketing?.type === 'percentage' && !skipDiscount) {
    singlePrice = item?.product.price || 0;
    output.baseCurrency_totalDiscount = item?.product?.discount * (item?.quantity || item?.productQuantity);
    output.secondaryCurrency_totalDiscount = getSecondaryCurrency(output?.baseCurrency_totalDiscount);

    output.baseCurrency_discount = item?.product?.discount;
    output.secondaryCurrency_discount = getSecondaryCurrency(item?.product?.discount);
  } else {
    singlePrice = item?.product?.price;
  }

  if (item?.marketing?.isActive && item?.marketing?.type === 'double_menu' && !skipDiscount) {
    const quantity = item?.quantity || item?.productQuantity;

    count += singlePrice * (quantity - discountQuantity);

    const totalDiscount = singlePrice * quantity - count;

    const discount = totalDiscount / discountQuantity || 0;

    output.baseCurrency_totalDiscount = Math.round(totalDiscount * 100) / 100;
    output.secondaryCurrency_totalDiscount = getSecondaryCurrency(output?.baseCurrency_totalDiscount);

    output.baseCurrency_discount = Math.round(discount * 100) / 100;
    output.secondaryCurrency_discount = getSecondaryCurrency(output?.baseCurrency_totalDiscount);

    // singlePrice *= item?.quantity || item?.productQuantity;
  } else {
    count += singlePrice * (item?.quantity || item?.productQuantity);
    // singlePrice *= item?.quantity || item?.productQuantity;
  }

  // item attribute price
  item?.selectedAttributes?.map((parent) => {
    parent?.attributeItems?.map((child) => {
      count += child?.extraPrice * (item?.quantity || item?.productQuantity);
      singlePrice += child?.extraPrice;
    });
  });

  output.baseCurrency_finalPrice = Math.round(count * 100) / 100;
  output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);
  // when marketing is reward
  if (item?.marketing?.isActive && item?.marketing?.type === 'reward') {
    console.log('item?.reward?.amount', item?.reward?.amount);
    output.finalReward.baseCurrency_amount = skipDiscount
      ? 0
      : (item?.reward?.amount || 0) * (item?.quantity || item?.productQuantity);
    output.finalReward.secondaryCurrency_amount = !skipDiscount
      ? 0
      : getSecondaryCurrency(output.finalReward.baseCurrency_amount);
    output.finalReward.points = skipDiscount
      ? 0
      : (item?.reward?.points || 0) * (item?.quantity || item?.productQuantity);
  }

  // when marketing is percentage
  if (item?.marketing?.isActive && item?.marketing?.type === 'percentage' && !skipDiscount) {
    // final price
    output.baseCurrency_finalPrice = Math.round(count * 100) / 100;
    output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);
    // product price
    output.baseCurrency_productPrice = Math.round(count * 100) / 100;
    output.secondaryCurrency_productPrice = getSecondaryCurrency(output?.baseCurrency_productPrice);
  }

  // when marketing is percentage
  if (item?.marketing?.isActive && item?.marketing?.type === 'double_menu' && !skipDiscount) {
    output.baseCurrency_finalPrice = Math.round(singlePrice * (item?.quantity || item?.productQuantity) * 100) / 100;
    output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);

    output.baseCurrency_productPrice = Math.round(singlePrice * 100) / 100;
    output.secondaryCurrency_productPrice = getSecondaryCurrency(output?.baseCurrency_productPrice);
  }

  if (item?.marketing?.type !== 'reward') {
    delete output.finalReward;
  }

  // return

  return output;
};

// double menu item price calculation
export const doubleDealManipulate = (addedItems) => {
  const doubleDealArray = [];
  const result = addedItems?.map((item) => {
    const quantity = item?.quantity || item?.productQuantity;
    if (!doubleDealArray?.find((child) => child?._id === item?.productId)) {
      const findAll = addedItems?.filter((child) => child?.productId === item?.productId);
      let count = 0;
      findAll?.map((item) => {
        count += item?.quantity || item?.productQuantity;
      });

      const discountQuantity = parseInt(count / 2, 10);
      let remaining = 0;

      if (quantity < discountQuantity) {
        remaining = discountQuantity - quantity;
      }

      doubleDealArray.push({
        _id: item?.productId,
        remaining,
      });

      return {
        ...item,
        discountQuantity: quantity < discountQuantity ? quantity : discountQuantity,
      };
    }
    if (doubleDealArray?.find((child) => child?._id === item?.productId)) {
      // -----------
      const findIndex = doubleDealArray?.findIndex((child) => child?._id === item?.productId);
      const { remaining } = doubleDealArray[findIndex];
      if (quantity < remaining) {
        doubleDealArray[findIndex].remaining = remaining - quantity;
      } else {
        doubleDealArray[findIndex].remaining = 0;
      }
      return {
        ...item,
        discountQuantity: quantity < remaining ? quantity : remaining,
      };
    }
  });

  return result;
};

// single item price calculation.
export const SingleItemcalculatePrice = (itemData, shopExchangeRate = 0) => {
  // getSecondaryCurrency
  const getSecondaryCurrency = (value) => Math.round(shopExchangeRate * value);

  let count = 0;

  const output = {
    baseCurrency_finalPrice: 0,
    baseCurrency_totalDiscount: 0,
    baseCurrency_discount: 0,
    baseCurrency_productPrice: 0,

    secondaryCurrency_finalPrice: 0,
    secondaryCurrency_totalDiscount: 0,
    secondaryCurrency_discount: 0,
    secondaryCurrency_productPrice: 0,
  };

  const deal = productDealForProductDetails(itemData);

  count = itemData?.product?.price * (itemData?.quantity || itemData?.productQuantity);

  if (deal === 'percentage') {
    output.baseCurrency_totalDiscount = itemData?.product?.discount * (itemData?.quantity || itemData?.productQuantity);
    output.secondaryCurrency_totalDiscount = getSecondaryCurrency(output?.baseCurrency_totalDiscount);

    output.baseCurrency_discount = itemData?.product?.discount;
    output.secondaryCurrency_discount = getSecondaryCurrency(itemData?.product?.discount);
  }

  itemData?.selectedAttributes?.map((parent) => {
    parent?.attributeItems?.map((child) => {
      count += child?.extraPrice * (itemData?.quantity || itemData?.productQuantity);
    });
  });

  output.baseCurrency_finalPrice = Math.round(count * 100) / 100;
  output.baseCurrency_productPrice = Math.round(count * 100) / 100;

  output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);
  output.secondaryCurrency_productPrice = getSecondaryCurrency(output?.baseCurrency_productPrice);

  console.log(deal, { product: itemData?.product }, itemData?.product?.price - itemData?.product?.discount, output);
  return output;
};

// compare two array
export const compareTwoArray = (firstArray, secondArray, item, user) => {
  const firstArrayTemp = JSON.stringify(firstArray.sort());
  const secondArrayTemp = JSON.stringify(secondArray.sort());
  return firstArrayTemp === secondArrayTemp && item?.owner?._id === user?._id;
};

// separate attributes id
export const separateAtributesId = (attributes) => {
  const separateAttributesItems = attributes?.map(({ selectedItems }) => selectedItems);

  let items = [];

  separateAttributesItems?.forEach((item) => {
    const temp = item?.map((atrItm) => atrItm?._id);
    items = [...items, ...temp];
  });

  return items;
};

// matched the meals
export const matchedMeals = (products, addedProduct) => {
  console.log({ products, addedProduct });
  const matched = {
    index: -1,
    lastIndex: -1,
    shouldAddInLastIndex: false,
    item: { ...addedProduct },
    isMatched: false,
  };

  products?.forEach((product, i) => {
    const productAttributes = separateAtributesId(product?.selectedAttributes);
    const addedAttributes = separateAtributesId(addedProduct?.selectedAttributes);
    const isSameProduct = product?.productId === addedProduct?.productId;
    if (
      productAttributes?.length === addedAttributes?.length &&
      compareTwoArray(productAttributes, addedAttributes) &&
      isSameProduct
    ) {
      matched.isMatched = true;
      matched.index = i;
    }

    if (isSameProduct) {
      matched.lastIndex = i;
    }
  });

  if (matched?.lastIndex < 0) {
    matched.shouldAddInLastIndex = true;
  }

  if (matched?.lastIndex > 0 && matched?.lastIndex < products?.length) {
    matched.lastIndex += 1;
  }

  return matched;
};

export const makeSingleProductDetails = (product, owner = {}) => {
  const deal = productDealForProductDetails(product);

  const productTemplate = {
    ...product,
    baseCurrency_discount: 0,
    baseCurrency_finalPrice: 0,
    baseCurrency_productPrice: 0,
    baseCurrency_totalDiscount: 0,
    isDoubleDeal: deal === 'double_menu',
    marketing: { ...product?.marketing },
    owner: { ...owner },
    product: { ...product },
    productId: product?._id,
    productName: product?.name,
    productQuantity: deal === 'double_menu' ? 2 : 1,
    secondaryCurrency_discount: 0,
    secondaryCurrency_finalPrice: 0,
    secondaryCurrency_productPrice: 0,
    secondaryCurrency_totalDiscount: 0,
    selectedAttributes:
      product?.selectedAttributes?.map((atr) => ({ ...atr, attributeItems: atr?.selectedItems })) || [],
    shop: { ...product?.shop },
    skipDiscount: true,
  };

  const shopExchangeRate = product?.shop?.shopExchangeRate || 0;

  const doubleDealItem = doubleDealManipulate([productTemplate])[0];

  const output = calculatePrice(doubleDealItem, false, doubleDealItem?.discountQuantity, shopExchangeRate);

  console.log({ productTemplate, deal, output, doubleDealItem });

  return { ...productTemplate, ...output };
};

export const populateProductData = (addedProducts, shopExchangeRate, skipDiscount = false) => {
  console.log({ addedProducts });
  const data = doubleDealManipulate(addedProducts).map((item) => {
    const shouldSkipDiscount = item?.skipDiscount && skipDiscount;
    let prices = {};
    prices = calculatePrice(item, shouldSkipDiscount, item?.discountQuantity, shopExchangeRate);
    return { ...item, ...prices };
  });

  return data;
};

export const getCard = (order) => {
  const summary = order?.oldOrderSummary;
  return summary?.baseCurrency_card;
};

export const getWallet = (order) => {
  const summary = order?.oldOrderSummary;
  return summary?.baseCurrency_wallet;
};

export const getCash = (order) => {
  const summary = order?.oldOrderSummary;
  return summary?.baseCurrency_cash;
};

export const getRewordItem = (addedItems, shopExchangeRate, user) => {
  let totalReward = 0;
  let rewordPrice = 0;
  const getSecondaryCurrency = (value) => Math.round((shopExchangeRate || 0) * value);

  addedItems?.map((item) => {
    const skipDiscount =
      item.skipDiscount === undefined
        ? !(item?.marketing?.type === 'reward' && item?.finalReward?.baseCurrency_amount > 0)
        : item?.skipDiscount;
    console.log(item?.productName, skipDiscount);
    if (
      (user ? item?.owner?._id === user?._id : true) &&
      item?.marketing?.isActive &&
      item?.marketing?.type === 'reward' &&
      !skipDiscount
    ) {
      console.log({ item });
      totalReward += item?.finalReward?.points;
      rewordPrice +=
        item?.product?.price * (item?.quantity || item?.productQuantity) - item?.finalReward?.baseCurrency_amount;
    }
  });

  return {
    points: totalReward,
    amount: rewordPrice,
    baseCurrency_amount: rewordPrice,
    secondaryCurrency_amount: getSecondaryCurrency(rewordPrice),
  };
};

const doubleMenuItemPriceCalculation = (addedItems, user) => {
  let count = 0;
  let itemWithAttribute = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;
    if (itemData?.marketing?.isActive && itemData?.marketing?.type === 'double_menu') {
      if (!array.includes(itemData?.productId)) {
        const doubleDealAllProduct = addedItems?.filter(
          (item) => item?.productId === itemData?.productId && (!user || item?.owner?._id === user?._id)
        );

        let quantity = 0;

        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity || item?.productQuantity;
        });

        price += itemData?.product?.price * parseInt(quantity / 2, 10);
        array.push(itemData?.productId);
      }

      itemWithAttribute += itemData?.baseCurrency_finalPrice - itemData?.baseCurrency_totalDiscount;

      // // item attribute price
      // itemData?.selectedAttributes?.map((parent) => {
      //   parent?.attributeItems?.map((child) => {
      //     itemWithAttribute += child?.extraPrice * (itemData?.quantity || itemData?.productQuantity);
      //   });
      // });
    }
    // console.log(count);
    count += price;
  });

  return { item: Math.round(count * 100) / 100, itemWithAttribute };
};

export const getUpdatedPaymentOptions = (order, oldOrderSummary) => {
  const paymentOption = order?.paymentMethod;

  const oldSummary = oldOrderSummary;
  const newSummary = order?.summary;

  const total_base_new =
    newSummary?.baseCurrency_totalAmount +
    newSummary?.baseCurrency_vat +
    newSummary?.baseCurrency_riderTip -
    newSummary?.baseCurrency_discount -
    newSummary?.reward?.baseCurrency_amount -
    newSummary?.baseCurrency_couponDiscountAmount;

  console.log(
    newSummary?.baseCurrency_totalAmount,
    newSummary?.baseCurrency_vat,
    newSummary?.baseCurrency_riderTip,
    newSummary?.baseCurrency_discount,
    newSummary?.reward?.baseCurrency_amount
  );

  const total_base_old =
    oldSummary?.baseCurrency_totalAmount +
    oldSummary?.baseCurrency_vat +
    oldSummary?.baseCurrency_riderTip -
    oldSummary?.baseCurrency_discount -
    oldSummary?.reward?.baseCurrency_amount -
    oldSummary?.baseCurrency_couponDiscountAmount;

  const shopExchangeRate = order?.shop?.shopExchangeRate;
  const getSecondaryCurrency = (value) => Math.round(shopExchangeRate * value);

  const output = {
    baseCurrency_cash: oldSummary?.baseCurrency_cash,
    secondaryCurrency_cash: oldSummary?.secondaryCurrency_cash,
    baseCurrency_card: oldSummary?.baseCurrency_card,
    secondaryCurrency_card: oldSummary?.secondaryCurrency_card,
    baseCurrency_wallet: oldSummary?.baseCurrency_wallet,
    secondaryCurrency_wallet: oldSummary?.secondaryCurrency_wallet,
  };

  console.log('first', output);

  //  21 - 25 = -4
  const diff = total_base_new - total_base_old;

  console.log('test', { oldSummary, newSummary, total_base_new, total_base_old });

  if (diff > 0) {
    output.baseCurrency_cash =
      paymentOption === 'cash' ? oldSummary?.baseCurrency_cash + diff : oldSummary?.baseCurrency_cash;
    output.baseCurrency_wallet =
      paymentOption === 'wallet' ? oldSummary?.baseCurrency_wallet + diff : oldSummary?.baseCurrency_wallet;
    output.baseCurrency_card =
      paymentOption === 'card' ? oldSummary?.baseCurrency_card + diff : oldSummary?.baseCurrency_card;
    console.log({ output });
  } else if (diff < 0) {
    if (paymentOption === 'cash') {
      const remaining = (oldSummary?.baseCurrency_cash || 0) + diff;

      output.baseCurrency_cash = remaining < 0 ? 0 : remaining;

      output.baseCurrency_wallet =
        remaining < 0 ? (oldSummary?.baseCurrency_wallet || 0) + remaining : oldSummary?.baseCurrency_wallet || 0;
    }

    if (paymentOption === 'card') {
      const remaining = (oldSummary?.baseCurrency_card || 0) + diff;

      output.baseCurrency_card = remaining < 0 ? 0 : remaining;

      output.baseCurrency_wallet =
        remaining < 0 ? (oldSummary?.baseCurrency_wallet || 0) + remaining : oldSummary?.baseCurrency_wallet || 0;
    }

    if (paymentOption === 'wallet') {
      const remaining = (oldSummary?.baseCurrency_wallet || 0) + diff;
      oldSummary.baseCurrency_wallet = remaining;
    }
  }

  output.secondaryCurrency_cash = getSecondaryCurrency(output?.baseCurrency_cash);
  output.secondaryCurrency_card = getSecondaryCurrency(output?.baseCurrency_card);
  output.secondaryCurrency_wallet = getSecondaryCurrency(output?.baseCurrency_wallet);
  output.baseCurrency_cash = Number((output?.baseCurrency_cash || 0).toFixed(2));
  output.baseCurrency_card = Number((output?.baseCurrency_card || 0).toFixed(2));
  output.baseCurrency_wallet = Number((output?.baseCurrency_wallet || 0).toFixed(2));

  console.log('data ==> ', { diff, total_base_new, total_base_old, output, paymentOption, oldSummary, newSummary });

  return output;
};

// calcualte total vat
export const calculateVAT = (total, precentage = 0) => Number((total * (precentage / 100)).toFixed(2));

// generate product summary for updated adjusted order
export const getPaymentSummary = (addedItems, order, vatPercentage, oldOrderSummary) => {
  console.log({ order });

  const shopExchangeRate = order?.shop?.shopExchangeRate;
  const getSecondaryCurrency = (value) => Math.round(shopExchangeRate * value);

  const totalDiscount = calculatetotalDiscountPrice(addedItems);

  const summary = oldOrderSummary;

  const totalProductAmount = totalBill(addedItems) + doubleMenuItemPriceCalculation(addedItems).itemWithAttribute;
  const totalAmount = totalProductAmount + summary?.baseCurrency_riderFee;

  const reward = getRewordItem(addedItems, shopExchangeRate);

  if (reward?.amount > order?.user?.tempRewardPoints) {
    successMsg('Insufficient points');
  }

  console.log('reward', { reward });

  console.log('double deal', doubleMenuItemPriceCalculation(addedItems));

  const templateSummary = {
    baseCurrency_productAmount: totalProductAmount,
    secondaryCurrency_productAmount: getSecondaryCurrency(totalProductAmount),
    baseCurrency_riderFee: summary?.baseCurrency_riderFee,
    baseCurrency_totalAmount: totalAmount,
    baseCurrency_discount: totalDiscount,
    secondaryCurrency_discount: getSecondaryCurrency(totalDiscount),
    baseCurrency_vat: calculateVAT(
      totalAmount -
        (summary?.baseCurrency_couponDiscountAmount || 0) -
        (reward?.baseCurrency_amount || 0) -
        (totalDiscount || 0),
      vatPercentage
    ),
    baseCurrency_cash: getCash({ oldOrderSummary }),
    secondaryCurrency_cash: getSecondaryCurrency(getCash({ oldOrderSummary })),
    baseCurrency_card: getCard({ oldOrderSummary }),
    secondaryCurrency_card: getSecondaryCurrency(getCard({ oldOrderSummary })),
    baseCurrency_wallet: getWallet({ oldOrderSummary }),
    secondaryCurrency_wallet: getSecondaryCurrency(getWallet({ oldOrderSummary })),
    reward,
    baseCurrency_doubleMenuItemPrice: doubleMenuItemPriceCalculation(addedItems).item,
    secondaryCurrency_doubleMenuItemPrice: getSecondaryCurrency(doubleMenuItemPriceCalculation(addedItems).item),
    baseCurrency_riderTip: summary?.baseCurrency_riderTip,
    baseCurrency_couponDiscountAmount: summary?.baseCurrency_couponDiscountAmount,
  };

  templateSummary.secondaryCurrency_totalAmount = getSecondaryCurrency(templateSummary?.baseCurrency_totalAmount);
  templateSummary.secondaryCurrency_vat = getSecondaryCurrency(templateSummary?.baseCurrency_vat);
  templateSummary.secondaryCurrency_riderTip = getSecondaryCurrency(summary?.baseCurrency_riderTip);
  templateSummary.secondaryCurrency_couponDiscountAmount = getSecondaryCurrency(
    templateSummary?.baseCurrency_couponDiscountAmount
  );

  templateSummary.secondaryCurrency_riderFee = getSecondaryCurrency(templateSummary?.baseCurrency_riderFee);

  return { ...templateSummary, ...getUpdatedPaymentOptions({ ...order, summary: templateSummary }, oldOrderSummary) };
};

// generate product json data for adjusting order
export const generateAdjustOrdeJsonData = (adjustedOrder) => {
  const adjustOrderTemplate = {
    orderId: adjustedOrder?._id,
    products: [],
    summary: {
      baseCurrency_productAmount: adjustedOrder?.summary?.baseCurrency_productAmount || 0,
      baseCurrency_riderFee: adjustedOrder?.summary?.baseCurrency_riderFee || 0,
      baseCurrency_totalAmount: adjustedOrder?.summary?.baseCurrency_totalAmount || 0,
      baseCurrency_discount: adjustedOrder?.summary?.baseCurrency_discount || 0,
      baseCurrency_vat: adjustedOrder?.summary?.baseCurrency_vat || 0,
      baseCurrency_wallet: adjustedOrder?.summary?.baseCurrency_wallet || 0,
      secondaryCurrency_wallet: adjustedOrder?.summary?.secondaryCurrency_wallet || 0,
      baseCurrency_card: adjustedOrder?.summary?.baseCurrency_card || 0,
      secondaryCurrency_card: adjustedOrder?.summary?.secondaryCurrency_card || 0,
      baseCurrency_cash: adjustedOrder?.summary?.baseCurrency_cash || 0,
      secondaryCurrency_cash: adjustedOrder?.summary?.secondaryCurrency_cash || 0,
      reward: {
        points: adjustedOrder?.summary?.reward?.amount || 0,
        baseCurrency_amount: adjustedOrder?.summary?.reward?.baseCurrency_amount || 0,
      },
      baseCurrency_doubleMenuItemPrice: adjustedOrder?.summary?.baseCurrency_doubleMenuItemPrice,
      baseCurrency_riderTip: adjustedOrder?.summary?.baseCurrency_riderTip,
      baseCurrency_couponDiscountAmount: adjustedOrder?.summary?.baseCurrency_couponDiscountAmount,
    },
    adjustmentReason: adjustedOrder?.adjustmentReason,
  };

  adjustOrderTemplate.products = adjustedOrder?.productsDetails?.map((product) => {
    const productTemplate = {
      product: product?.productId,
      perProduct: product?.baseCurrency_productPrice,
      discount: product?.baseCurrency_discount,
      totalProductAmount: product?.baseCurrency_finalPrice,
      totalDiscount: product?.baseCurrency_discount,
      quantity: product?.productQuantity,
      attributes: product?.selectedAttributes?.map(({ id, selectedItems }) => ({
        _id: id,
        attributeItems: selectedItems?.map(({ _id, extraPrice }) => ({ _id, extraPrice })),
      })),
      isDoubleDeal: product?.isDoubleDeal,
      productSpecialInstruction: product?.productSpecialInstruction,
      reward: {
        amount: product?.finalReward?.baseCurrency_amount,
        points: product?.finalReward?.points,
      },
      marketingId: product?.marketing?._id,
      owner: product?.owner?._id,
    };

    if (product?.marketing?.type !== 'reward') {
      delete productTemplate?.reward;
    }

    return productTemplate;
  });

  if (!adjustedOrder?._id) {
    successMsg('Order is not found');
    return { status: false };
  }

  if (!adjustedOrder?.adjustmentReason) {
    successMsg('Provide adjustment reasone please');
    return { status: false };
  }

  if (!adjustedOrder?.productsDetails?.length) {
    successMsg("Product list shoul'd not be empty");
    return { status: false };
  }

  if (adjustedOrder?.summary?.reward?.amount > adjustedOrder?.user?.tempRewardPoints) {
    successMsg('Insufficient points');
    return { status: false };
  }

  return { status: true, data: adjustOrderTemplate };
};
