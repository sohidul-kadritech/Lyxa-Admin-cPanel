import { Box } from '@mui/material';
import Product from './Product';

export default function RegularOrder({ order }) {
  console.log('order-product-details', order?.productsDetails);

  return (
    <Box pt={1}>
      {order?.productsDetails?.map((product, i, { length: l }) => (
        <Product product={product} key={i} isFirst={i === 0} isLast={i === l - 1} />
      ))}
    </Box>
  );
}
