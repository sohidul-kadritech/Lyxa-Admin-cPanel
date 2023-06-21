import { Box } from '@mui/material';
import Product from './Product';

export default function RegularOrder({ order }) {
  return (
    <Box pt={1}>
      {order?.productsDetails?.map((product, i, { length: l }) => (
        <Product product={product} key={product._id} isFirst={i === 0} isLast={i === l - 1} />
      ))}
    </Box>
  );
}
