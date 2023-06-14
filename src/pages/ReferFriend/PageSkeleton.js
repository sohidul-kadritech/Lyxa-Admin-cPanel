import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function PageSkeleton() {
  return (
    <Box>
      <Stack flexDirection="column" gap="10px">
        <Stack flexDirection="row" gap="5%" marginBottom="16px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="5%" marginBottom="16px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
        </Stack>
      </Stack>
      <Stack flexDirection="column" gap="0px" marginTop="30px">
        <Stack flexDirection="row" gap="5%" marginBottom="16px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="5%" marginBottom="16px">
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
          <Stack flexDirection="row" width="50%" justifyContent="space-between" alignItems="center" gap="20">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="40px" sx={{ borderRadius: '20px' }} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PageSkeleton;
