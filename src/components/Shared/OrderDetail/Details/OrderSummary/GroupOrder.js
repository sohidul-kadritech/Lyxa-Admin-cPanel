/* eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import Product from './Product';

const findProduct = (cartProducts, productsDetails) => {
  const products = [];

  cartProducts?.forEach((cartProduct) => {
    let addProduct = null;

    productsDetails?.forEach((productDetailProduct) => {
      const cartProductId = typeof cartProduct?.product === 'string' ? cartProduct?.product : cartProduct?.product?._id;

      if (productDetailProduct?.productId !== cartProductId) return;
      if (productDetailProduct?.productQuantity !== cartProduct?.quantity) return;

      let include = true;

      cartProduct?.selectedAttributes?.forEach((attrItemId) => {
        let found = false;

        productDetailProduct?.selectedAttributes?.forEach((productAttribute) => {
          if (productAttribute?.attributeItems?.find((item) => item?.id === attrItemId)) {
            found = true;
          }
        });

        if (found === false) include = false;
      });

      if (include) addProduct = productDetailProduct;
    });

    if (addProduct) products?.push(addProduct);
  });

  return products;
};

const groupProductsByUser = (order) => {
  const groups = [];

  order?.cart?.cartItems?.forEach((cart) => {
    const data = {};
    data.user = cart?.user;
    data.products = findProduct(cart?.products, order?.productsDetails);
    groups.push(data);
  });

  return groups;
};

export default function GroupOrder({ order }) {
  const groups = useMemo(() => groupProductsByUser(order), []);

  return (
    <Box pt={1}>
      {groups?.map((grp, gi, { length: gl }) => (
        <Box key={grp?.user?._id} pb={gi === gl - 1 ? 0 : 5}>
          <Typography variant="inherit" fontSize={15} fontWeight={700} pb={2}>
            {grp?.user?.name}
          </Typography>
          <Box>
            {grp?.products?.map((product, i, { length: l }) => (
              <Product product={product} key={product._id} isFirst={i === 0} isLast={i === l - 1} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
