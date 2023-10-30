/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
import { truncate } from 'lodash';

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

// calculate product price for adjustment order
export const getProductPriceForAdjustMent = (product, deal) => {
  if (deal === 'double_menu') {
    return { finalPrice: product?.price, originalPrice: product?.price, shouldShowBoth: truncate };
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

/*
    let creatorProductAmountRegular = totalBill(addedItems, user, false, true);
    let creatorProductAmountDiscount = totalBill(addedItems, user);

*/
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

// calculate price
export const calculatePrice = (addedItems) => {
  let count = 0;
  const array = [];
  addedItems?.map((itemData) => {
    if (itemData?.marketing?.isActive && itemData?.marketing?.type === 'double_menu') {
      if (!array.includes(itemData?._id)) {
        const doubleDealAllProduct = addedItems?.filter((item) => item?._id === itemData?._id);
        let quantity = 0;
        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity;
        });

        count += itemData?.price * (parseInt(quantity / 2, 10) + (quantity % 2));
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

// double menu itemp price calculation
export const doubleMenuItemPriceCalculation = (addedItems, user) => {
  let count = 0;
  const array = [];

  addedItems?.map((itemData) => {
    if (user && itemData?.owner?._id !== user?._id) {
      return;
    }
    let price = 0;
    if (itemData?.marketing?.isActive && itemData?.marketing?.type === 'double_menu') {
      if (!array.includes(itemData?._id)) {
        const doubleDealAllProduct = addedItems?.filter(
          (item) => item?._id === itemData?._id && (!user || item?.owner?._id === user?._id),
        );

        let quantity = 0;

        doubleDealAllProduct?.map((item) => {
          quantity += item?.quantity;
        });

        price += itemData?.price * parseInt(quantity / 2, 10);
        array.push(itemData?._id);
      }
    }
    // console.log(count);
    count += price;
  });

  return Math.round(count * 100) / 100;
};

// single item price calculation.
export const SingleItemcalculatePrice = (itemData) => {
  let count = 0;

  const { quantity } = itemData;

  count = itemData?.price * quantity;

  console.log({ itemData });

  itemData?.selectedAttributes?.map((parent) => {
    parent?.attributeItems?.map((child) => {
      count += child?.extraPrice * itemData?.quantity;
      console.log({ count });
    });
  });

  return Math.round(count * 100) / 100;
};

export const compareTwoArray = (firstArray, secondArray, item, user) => {
  const firstArrayTemp = JSON.stringify(firstArray.sort());
  const secondArrayTemp = JSON.stringify(secondArray.sort());
  return firstArrayTemp === secondArrayTemp && item?.owner?._id === user?._id;
};

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
    item: {},
    isMatched: false,
  };

  products?.forEach((product, i) => {
    const productAttributes = separateAtributesId(product?.selectedAttributes);
    const addedAttributes = separateAtributesId(addedProduct?.selectedAttributes);
    const isSameProduct = product?.productId;

    if (
      productAttributes?.length === addedAttributes?.length &&
      compareTwoArray(productAttributes, addedAttributes) &&
      isSameProduct
    ) {
      matched.isMatched = true;
      matched.index = i;
    }
  });

  console.log(matched);
};
