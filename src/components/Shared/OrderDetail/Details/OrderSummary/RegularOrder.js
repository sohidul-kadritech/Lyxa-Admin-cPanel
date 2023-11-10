import { Box } from '@mui/material';
import Product from './Product';
import { modifyReplaceOrderForProductDetails } from './helpers';

export default function RegularOrder({ order }) {
  return (
    <Box pt={1}>
      {modifyReplaceOrderForProductDetails(order)?.map((product, i, { length: l }) => (
        <Product
          product={product}
          key={i}
          isFirst={i === 0}
          isLast={i === l - 1}
          shopExchangeRate={order?.shop?.shopExchangeRate}
        />
      ))}
    </Box>
  );
}
