import { Box, Skeleton } from '@mui/material';
import React from 'react';

function MapSkeleton() {
  return (
    <Box>
      <Skeleton width="100%" height="100%" sx={{ borderRadius: '7px' }} />
    </Box>
  );
}

export default MapSkeleton;