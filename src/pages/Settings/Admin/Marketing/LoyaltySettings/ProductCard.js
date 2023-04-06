import { Avatar, Box, Stack, Typography } from '@mui/material';

export default function ProductCard({ product, currency, ...props }) {
  return (
    <Stack direction="row" alignItems="flex-start" gap="10px" {...props}>
      <Avatar src={product?.images[0]} alt={product?.name} variant="rounded" sx={{ width: 86, height: 68 }} />
      <Box>
        <Typography variant="body2" mb={1.5}>
          {product?.name}
        </Typography>
        <Typography
          mb={1.5}
          sx={{
            fontWeight: '400!important',
            fontSize: '10px!important',
            lineHeight: '12px!important',
          }}
        >
          {product?.shop?.shopName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '12px!important',
          }}
        >
          <span
            style={{
              color: '#15BFCA',
            }}
          >
            {product?.reward?.points} Pts{' '}
          </span>
          <span
            style={{
              color: '#A3A3A3',
            }}
          >
            {currency} {product?.reward?.amount}
          </span>
        </Typography>
      </Box>
    </Stack>
  );
}
