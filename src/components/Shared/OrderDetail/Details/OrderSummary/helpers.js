/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */

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

      // console.log('extractedAtributes', extractAttributeItems(product?.attributes, attributes));

      result.productQuantity = quantity;

      // result.baseCurrency_finalPrice =

      return { ...result };
    },
  );

  console.log('updatedProductDetails', productsDetails);

  if (productsDetails?.length > 0) {
    return [...productsDetails, ...orderProductDetails];
  }

  return [...orderProductDetails];
};
