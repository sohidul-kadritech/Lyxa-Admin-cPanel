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

export const getProductPriceFroAdjustMent = (product, deal) => {
  console.log({ product });
  if (deal === 'double_menu') {
    return product?.price;
  }

  if (deal === 'reward') {
    return product?.price;
  }
  if (deal === 'percentage') {
    return product?.price - product?.discount;
  }

  return product?.price;
};
