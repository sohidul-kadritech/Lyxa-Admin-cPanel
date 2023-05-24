import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function TermsAndConditionsSkeleton() {
  return (
    <Box sx={{ marginTop: '30px' }}>
      <Box>
        <Stack gap="6px">
          <Skeleton width="100%" height="30px"></Skeleton>
          <Skeleton width="100%" height="400px"></Skeleton>
        </Stack>
      </Box>
    </Box>
  );
}

export default TermsAndConditionsSkeleton;
