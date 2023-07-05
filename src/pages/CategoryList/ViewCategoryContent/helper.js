export const searchSubCategoriesAndProduct = (subCategories, qString, setRender) => {
  subCategories?.forEach((subCategory) => {
    let name = (subCategory.subCategory?.name || '').toUpperCase();

    if (name.search(qString.toUpperCase()) === -1) {
      subCategory.hidden = true;

      subCategory?.sortedProducts?.forEach((product) => {
        name = (product?.name || '').toUpperCase();

        if (name.search(qString.toUpperCase()) === -1) {
          product.hidden = true;
        } else {
          subCategory.hidden = false;
          product.hidden = false;
        }
      });
    } else {
      subCategory.hidden = false;
      subCategory?.sortedProducts?.forEach((product) => {
        product.hidden = false;
      });
    }
  });

  setRender((prev) => !prev);
};

export const searchProducts = (products, qString, setRender) => {
  products?.forEach((product) => {
    const name = (product?.name || '').toUpperCase();

    if (name.search(qString.toUpperCase()) === -1) {
      product.hidden = true;
    } else {
      product.hidden = false;
    }
  });

  setRender((prev) => !prev);
};

// export const localSearch = (category, qString, setRender) => {
//   if(category?.category?.type === 'food'){
//     if(category?.category?.)

//     searchProducts(category?.sortedProducts, qString, setRender, category);
//   }else{

//   }
// };
