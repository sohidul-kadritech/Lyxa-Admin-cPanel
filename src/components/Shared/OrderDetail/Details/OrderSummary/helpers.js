/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */

import FormateBaseCurrency from '../../../../Common/FormateBaseCurrency';
import FormatesecondaryCurrency from '../../../../Common/FormatesecondaryCurrency';

export const extractAttributeItems = (atributes, selectedAtributes) => {
  const result = [];
  console.log({ atributes, selectedAtributes });

  atributes?.forEach((atr) => {
    // if not exist the atribute
    if (!result?.find((itm) => atr?._id === itm?._id)) {
      const template = {
        _id: atr?._id,
        ...atr,
        data: { ...atr },
        selectedItems: [],
      };

      const findSelectedAtribute = selectedAtributes?.find((item) => item?.id === atr?._id);

      if (findSelectedAtribute) {
        const allSelectedItems = findSelectedAtribute?.attributeItems?.map(({ id }) => id);
        const selectedItems = atr?.items?.filter((item) => allSelectedItems?.includes(item?._id));

        template.selectedItems = selectedItems;

        result.push(template);
      }
    }
  });

  return result;
};

export const modifyReplaceOrderForProductDetails = (order) => {
  console.log({
    productsDetails: order?.productsDetails,
    adjustOrderRequest: order?.adjustOrderRequest?.replacedProducts,
  });

  const shopExchangeRate = order?.shop?.shopExchangeRate || 0;

  const getSecondaryCurrency = (value) => Math?.round(shopExchangeRate * Number(value || 0));

  const orderProductDetails = order?.productsDetails || [];

  const productsDetails = (order?.adjustOrderRequest?.replacedProducts || [])?.map(
    ({ quantity, product, attributes }) => {
      const result = {
        ...product,
        selectedAttributes: [...extractAttributeItems(product?.attributes, attributes)],
        product: { ...product },
        isReplaced: true,
      };

      result.productQuantity = quantity;

      return { ...result };
    },
  );

  if (productsDetails?.length > 0) {
    return [...productsDetails, ...orderProductDetails];
  }

  return [...orderProductDetails];
};

export const dualCurrencyPriceReward = (deal, product, exchangeRate, showBoth = false) => {
  /*

{deal === 'percentage' &&
`${FormateBaseCurrency.get(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount)}`}


{deal === 'reward' &&
`${product?.finalReward?.points} pts + ${FormateBaseCurrency.get(
  product?.finalReward?.baseCurrency_amount,
)}`}


{deal === 'double_menu' &&
`${FormateBaseCurrency.get(
  product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0,
)}`}

*/

  const template = {
    base: 0,
    second: 0,
  };

  if (deal === 'percentage') {
    template.base = FormateBaseCurrency.get(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount);
    template.second = FormatesecondaryCurrency.get(
      product?.secondaryCurrency_finalPrice - product?.secondaryCurrency_totalDiscount,
    );
  }

  if (deal === 'reward') {
    template.base = `${product?.finalReward?.points} pts + ${FormateBaseCurrency.get(
      product?.finalReward?.baseCurrency_amount,
    )}`;
    template.second = `${product?.finalReward?.points} pts + ${FormatesecondaryCurrency.get(
      product?.finalReward?.secondaryCurrency_amount,
    )}`;
  }

  if (deal === 'double_menu') {
    template.base = FormateBaseCurrency.get(
      product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0,
    );

    template.second = FormatesecondaryCurrency.get(
      product?.secondaryCurrency_finalPrice - product?.secondaryCurrency_totalDiscount,
    );
  }

  console.log({ exchangeRate });

  if (exchangeRate > 0) {
    return template.second;
  }

  return template?.base;
};
