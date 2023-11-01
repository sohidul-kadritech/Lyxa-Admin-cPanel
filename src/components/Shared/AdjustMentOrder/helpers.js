/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */

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

export const totalBill = (addedItems, user, skipDiscount, skipPercentage) => {
  let count = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;

    if (
      itemData?.marketing?.isActive &&
      itemData?.marketing?.type === 'percentage' &&
      !skipDiscount &&
      !skipPercentage
    ) {
      price = itemData?.discountPrice * itemData.quantity;
    } else if (itemData?.marketing?.isActive && itemData?.marketing?.type === 'double_menu' && !skipDiscount) {
      if (!array.includes(itemData?._id)) {
        const doubleDealAllProduct = addedItems?.filter(
          (item) => item?._id === itemData?._id && (user ? item?.owner?._id === user?._id : true),
        );

        let quantity = 0;
        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity;
        });

        price += itemData?.price * (parseInt(quantity / 2, 10) + (quantity % 2));
        array.push(itemData?._id);
      }
    } else {
      price = itemData?.price * itemData.quantity;
    }
    // console.log(count);
    count += price;

    itemData?.attributes?.map((parent) => {
      parent?.items?.map((child) => {
        if (itemData?.selectedAttributes?.includes(child?._id)) {
          count += child?.extraPrice * itemData?.quantity;
        }
      });
    });
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
  };

  if (item?.marketing?.isActive && item?.marketing?.type === 'percentage' && !skipDiscount) {
    singlePrice = item?.discountPrice || 0;
  } else {
    singlePrice = item?.product?.price;
  }

  if (item?.marketing?.isActive && item?.marketing?.type === 'double_menu' && !skipDiscount) {
    const quantity = item?.quantity || item?.productQuantity;

    count += singlePrice * (quantity - discountQuantity);

    /*
    
    singlePrice 100
    quantity 4
    discountQue 3

    count = 100*1 = 100
    totalDiscoutn = 100*4 = 100


    
    */

    const totalDiscount = singlePrice * quantity - count;
    // quantity - discountQuantity > 0 ? singlePrice * discountQuantity : item?.baseCurrency_totalDiscount;
    const discount = totalDiscount / discountQuantity;

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

  console.log({ count, singlePrice });

  if (item?.marketing?.type !== 'double_menu') {
    // final price
    output.baseCurrency_finalPrice = Math.round(count * 100) / 100;
    output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);
    // product price
    output.baseCurrency_productPrice = Math.round(count * 100) / 100;
    output.secondaryCurrency_productPrice = getSecondaryCurrency(output?.baseCurrency_productPrice);
  } else {
    output.baseCurrency_finalPrice = Math.round(singlePrice * (item?.quantity || item?.productQuantity) * 100) / 100;
    output.secondaryCurrency_finalPrice = getSecondaryCurrency(output?.baseCurrency_finalPrice);

    output.baseCurrency_productPrice = Math.round(singlePrice * 100) / 100;
    output.secondaryCurrency_productPrice = getSecondaryCurrency(output?.baseCurrency_productPrice);
  }

  // return

  return output;
};

// double menu item price calculation
export const doubleDealManipulate = (addedItems) => {
  const doubleDealArray = [];
  const result = addedItems?.map((item) => {
    if (!doubleDealArray?.find((child) => child?._id === item?._id)) {
      const findAll = addedItems?.filter((child) => child?._id === item?._id);
      let count = 0;
      findAll?.map((item) => {
        count += item?.quantity || item?.productQuantity;
      });
      const discountQuantity = parseInt(count / 2, 10);
      let remaining = 0;
      if ((item?.quantity || item?.productQuantity) < discountQuantity) {
        remaining = discountQuantity - (item?.quantity || item?.productQuantity);
      }
      doubleDealArray.push({
        _id: item?._id,
        remaining,
      });
      return {
        ...item,
        discountQuantity:
          (item?.quantity || item?.productQuantity) < discountQuantity
            ? item?.quantity || item?.productQuantity
            : discountQuantity,
      };
    }
    if (doubleDealArray?.find((child) => child?._id === item?._id)) {
      // -----------
      const findIndex = doubleDealArray?.findIndex((child) => child?._id === item?._id);
      const { remaining } = doubleDealArray[findIndex];
      if ((item?.quantity || item?.productQuantity) < remaining) {
        doubleDealArray[findIndex].remaining = remaining - item?.quantity || item?.productQuantity;
      } else {
        doubleDealArray[findIndex].remaining = 0;
      }
      return {
        ...item,
        discountQuantity:
          (item?.quantity || item?.productQuantity) < remaining ? item?.quantity || item?.productQuantity : remaining,
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
  };

  const shopExchangeRate = product?.shop?.shopExchangeRate || 0;

  const doubleDealItem = doubleDealManipulate([productTemplate])[0];

  const output =
    deal === 'double_menu'
      ? calculatePrice(doubleDealItem, false, doubleDealItem?.discountQuantity, shopExchangeRate)
      : SingleItemcalculatePrice({ ...productTemplate }, shopExchangeRate);

  console.log({ productTemplate, deal, output, doubleDealItem });

  return { ...productTemplate, ...output };
};
