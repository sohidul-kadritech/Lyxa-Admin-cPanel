import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function Row() {
  return (
    <Stack direction="row" alignItems="center" gap={3}>
      <Skeleton width="36px" height="36px" sx={{ borderRadius: '50%' }} />
      <Stack direction="row" flex={1} alignItems="center" gap={3}>
        <Skeleton flex={1} width="100%" height="20px" />
        <Skeleton width="20px" height="20px" />
      </Stack>
    </Stack>
  );
}
function AddSellersSkeleton() {
  return (
    <Box sx={{ padding: '12px 20px 10px 20px' }}>
      <Stack gap={2} sx={{ width: '100%', borderRadius: '7px', marginTop: '20px' }}>
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
      </Stack>
    </Box>
  );
}

export default AddSellersSkeleton;
