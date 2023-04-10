import { Avatar, Box, Stack, Typography } from '@mui/material';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';

export default function Product({ product }) {
  return (
    <Stack direction="row" alignItems="center" gap={5}>
      <HandleIcon className="drag-handler" />
      <Avatar src={product?.image} alt={product?.name} variant="rounded" sx={{ width: 66, height: 52 }} />
      <Box>
        <Typography variant="body4" fontWeight={600}>
          {product?.name}
        </Typography>
        <Typography variant="body4">{product?.line2}</Typography>
        {product?.line3 && <Typography variant="body4">{product?.line3}</Typography>}
      </Box>
    </Stack>
  );
}
