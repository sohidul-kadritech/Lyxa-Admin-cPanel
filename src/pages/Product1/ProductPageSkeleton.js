import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function Row() {
  return (
    <Box>
      <Stack flexDirection="row" justifyContent="space-between" marginBottom="20px" alignItems="center">
        <Box>
          <Stack flexDirection="row" gap="10px">
            <Skeleton width="60px" height="60px" sx={{ borderRadius: '50%' }}></Skeleton>
            <Skeleton width="130px" height="60px"></Skeleton>
          </Stack>
        </Box>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
      </Stack>
    </Box>
  );
}
function ProductPageSkeleton() {
  return (
    <Box>
      <Stack flexDirection="row" justifyContent="space-between" marginBottom="20px">
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
        <Skeleton width="200px" height="20px"></Skeleton>
      </Stack>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </Box>
  );
}

export default ProductPageSkeleton;
