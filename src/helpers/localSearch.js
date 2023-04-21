export const local_product_search = (qString, pairs) => {
  let name;

  pairs?.forEach((pair) => {
    name = (pair?.category?.category?.name || '').toUpperCase();
    if (name.search(qString.toUpperCase()) !== -1) {
      pair.category.category.matched = true;
      pair?.sortedProducts?.forEach((product) => {
        product.matched = true;
      });
    } else {
      pair.category.category.matched = false;

      pair?.sortedProducts?.forEach((product) => {
        name = (product?.name || '').toUpperCase();

        if (name.search(qString.toUpperCase()) !== -1) {
          product.matched = true;
          pair.category.category.matched = true;
        } else {
          product.matched = false;
        }
      });
    }
  });

  return pairs;
};
