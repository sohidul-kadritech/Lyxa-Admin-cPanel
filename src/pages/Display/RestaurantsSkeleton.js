import { Box, Skeleton, Stack } from '@mui/material';

export default function PageSkeleton() {
  return (
    <Box>
      {new Array(5).fill(0).map((element, index) => (
        <Product key={index} />
      ))}
    </Box>
  );
}

function Product() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={3}
      mt={4}
      mb={4}
      sx={{
        height: '78px',
        position: 'relative',
        marginBottom: '15px',
      }}
    >
      <Skeleton variant="rounded" width={74} height={74} />
      <Stack gap={3}>
        <Skeleton height={10} width={90} />
        <Skeleton height={8} width={190} />
        <Skeleton height={8} width={140} />
      </Stack>
    </Stack>
  );
}
