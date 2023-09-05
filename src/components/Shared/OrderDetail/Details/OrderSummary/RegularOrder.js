import { Box } from '@mui/material';
import Product from './Product';

export default function RegularOrder({ order }) {
  console.log('order', order);
  return (
    <Box pt={1}>
      {order?.productsDetails?.map((product, i, { length: l }) => (
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
