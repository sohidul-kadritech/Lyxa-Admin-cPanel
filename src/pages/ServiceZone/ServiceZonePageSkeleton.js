import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function Row() {
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Stack flexDirection="row" gap={20}>
        <Box flex={1}>
          <Skeleton width={220} height={30}></Skeleton>
        </Box>
        <Box flex={1}>
          <Skeleton width={220} height={30}></Skeleton>
        </Box>
        <Box flex={1}>
          <Skeleton width={220} height={30}></Skeleton>
        </Box>
        <Box flex={1}>
          <Skeleton width={220} height={30}></Skeleton>
        </Box>
      </Stack>
    </Box>
  );
}

function ServiceZonePageSkeleton() {
  return (
    <Box>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </Box>
  );
}

export default ServiceZonePageSkeleton;
