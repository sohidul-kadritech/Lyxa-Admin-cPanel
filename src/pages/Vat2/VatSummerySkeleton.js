import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function VatSummerySkeleton() {
  return (
    <Box>
      <Stack flexDirection="row" gap="30px">
        <Skeleton flex="1" width="33%" height="102px" />
        <Skeleton flex="1" width="33%" height="102px" />
        <Skeleton flex="1" width="33%" height="102px" />
      </Stack>
    </Box>
  );
}

export default VatSummerySkeleton;
