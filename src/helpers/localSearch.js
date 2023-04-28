export const local_product_category_search = (qString, pairs) => {
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

export const local_product_category_subCategory_search = (qString, pairs) => {
  let name;

  pairs?.forEach((pair) => {
    name = (pair?.category?.category?.name || '').toUpperCase();

    if (name.search(qString.toUpperCase()) !== -1) {
      pair.category.category.matched = true;

      pair?.subCategories?.forEach((subCategory) => {
        subCategory.subCategory.matched = true;

        subCategory?.sortedProducts?.forEach((product) => {
          product.matched = true;
        });
      });
    } else {
      pair.category.category.matched = false;

      pair?.subCategories?.forEach((subCategory) => {
        name = (subCategory.subCategory?.name || '').toUpperCase();

        if (name.search(qString.toUpperCase()) !== -1) {
          subCategory.subCategory.matched = true;
          pair.category.category.matched = true;

          subCategory?.sortedProducts?.forEach((product) => {
            product.matched = true;
          });
        } else {
          subCategory.subCategory.matched = false;

          subCategory?.sortedProducts?.forEach((product) => {
            name = (product?.name || '').toUpperCase();

            if (name.search(qString.toUpperCase()) !== -1) {
              subCategory.subCategory.matched = true;
              pair.category.category.matched = true;
              product.matched = true;
            } else {
              product.matched = false;
            }
          });
        }
      });
    }
  });

  return pairs;
};
