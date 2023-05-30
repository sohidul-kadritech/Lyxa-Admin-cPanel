import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function PageSkeleton() {
  return (
    <Box>
      <Stack flexDirection="column" gap="30px">
        <Stack flexDirection="row" gap="5%" marginBottom="30px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" gap="20">
            <Skeleton width="40%" height="80px" />
            <Skeleton width="40%" height="80px" />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" gap="20">
            <Skeleton width="40%" height="80px" />
            <Skeleton width="40%" height="80px" />
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="5%" marginBottom="30px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" gap="20">
            <Skeleton width="40%" height="80px" />
            <Skeleton width="40%" height="80px" />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" gap="20">
            <Skeleton width="40%" height="80px" />
            <Skeleton width="40%" height="80px" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PageSkeleton;
