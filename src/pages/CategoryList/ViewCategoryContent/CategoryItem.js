import { Box, Stack, Typography } from '@mui/material';
import ProductItem from './ProductItem';
import SubCategoryItem from './SubCategoryItem';

export default function CategoryItem({ category }) {
  if (!category?.category?.category?.matched) return null;

  return (
    <Box>
      <Box pt={4} pb={1}>
        <Typography variant="body2" fontSize="16px" fontWeight={600} color="text.secondary2" fontStyle="italic">
          {category?.category?.shop?.shopName || 'Shop Name'}
        </Typography>
      </Box>
      <Box>
        {category?.category?.type !== 'food' && (
          <Stack>
            {category?.subCategories?.map((subCategory) => (
              <SubCategoryItem subCategory={subCategory} key={subCategory?.subCategory?._id} />
            ))}
            {!category?.subCategories?.length && (
              <Typography variant="body2" py={3}>
                No sub-categories
              </Typography>
            )}
          </Stack>
        )}
        {category?.category?.type === 'food' && (
          <Stack
            pt={3}
            sx={{
              '& > div:first-of-type': {
                paddingTop: '0px',
              },
              '& > div:last-of-type': {
                borderBottom: 'none',
              },
            }}
          >
            {category?.sortedProducts?.map((product, i, { length: l }) => (
              <ProductItem product={product} key={product._id} isLast={i === l - 1} isFirst={i === 0} />
            ))}
            {!category?.sortedProducts?.length && (
              <Typography variant="body2" py={3}>
                No products
              </Typography>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
