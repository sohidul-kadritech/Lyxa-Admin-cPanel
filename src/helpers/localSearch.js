export const local_product_search = (qString, pairs) => {
  const result = [];
  let name;
  let hasMatchedChild;

  pairs?.forEach((pair) => {
    name = (pair?.category?.category?.name || '').toUpperCase();
    hasMatchedChild = false;

    if (name.search(qString.toUpperCase()) !== -1) {
      result.push(pair);
    } else {
      pair?.sortedProducts?.forEach((product) => {
        name = (product?.name || '').toUpperCase();

        if (name.search(qString.toUpperCase()) !== -1) {
          hasMatchedChild = true;
        } else {
          product.didNotMatch = true;
        }
      });

      if (hasMatchedChild) {
        result.push(pair);
      }
    }
  });

  return result.map((pair) => {
    pair.sortedProducts = pair.sortedProducts.filter((product) => !product.didNotMatch);
    return pair;
  });
};

// if search key in category display whole category
// if not in category search in products
// if keep only products what have the search key
