import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';

export default function ProductCard({ product, currency, loading, ...props }) {
  if (loading) {
    return <ComponentSkeleton />;
  }

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

function ComponentSkeleton() {
  return (
    <Stack
      direction="row"
      gap={3}
      sx={{
        height: '78px',
        position: 'relative',
        marginBottom: '15px',
      }}
    >
      <Skeleton variant="rounded" width={86} height={68} />
      <Stack gap={1.5}>
        <Skeleton height={25} width={150} />
        <Skeleton height={15} />
        <Skeleton height={15} />
      </Stack>
    </Stack>
  );
}
