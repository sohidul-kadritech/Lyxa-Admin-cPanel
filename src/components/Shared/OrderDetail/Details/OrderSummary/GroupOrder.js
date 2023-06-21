/* eslint-disable no-unused-vars */
import { Avatar, Box, Stack, Typography } from '@mui/material';
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
          <Stack direction="row" alignItems="center" pb={2} gap={1.5}>
            <Avatar
              src={grp?.user?.profile_photo}
              sx={{
                width: '32px',
                height: '32px',
              }}
            >
              {grp?.user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="inherit" fontSize={15} fontWeight={600}>
              {grp?.user?.name}
            </Typography>
          </Stack>
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
