/* eslint-disable no-unused-vars */
export const generateProductData = (order, replaceOrder, suggestedOrder) => {
  const template = {
    orderId: order?._id,
    suggestedProducts: [],
    replacedProducts: [],
    adjustmentReason: '',
  };

  template.replacedProducts = replaceOrder?.map(({ productId, productQuantity, note, selectedAttributes }) => {
    const templateReplaceProduct = {
      product: productId,
      quantity: productQuantity,
      attributes: [],
      note,
      productSpecialInstruction: '',
    };

    templateReplaceProduct.attributes = selectedAttributes?.map(({ id, selectedItems }) => ({
      id,
      attributeItems: selectedItems.map(({ _id }) => ({
        id: _id,
      })),
    }));

    return templateReplaceProduct;
  });

  template.suggestedProducts = suggestedOrder?.map(({ _id }) => {
    const templateReplaceProduct = {
      product: _id,
      quantity: 1,
      attributes: [],
      productSpecialInstruction: '',
    };

    return templateReplaceProduct;
  });

  if (!order?._id) {
    return {
      status: false,
      msg: 'Order not found',
    };
  }

  if (!replaceOrder?.length) {
    return {
      status: false,
      msg: 'Please select a product to replacement',
    };
  }

  return { status: true, data: template };
};
