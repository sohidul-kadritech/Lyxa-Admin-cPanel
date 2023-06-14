import { Box, Skeleton } from '@mui/material';
import React from 'react';
import ShopProfileSkeleton from '../ShopProfile/Sekleton';

function PageSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" width={210} height={60}></Skeleton>
      <ShopProfileSkeleton />
    </Box>
  );
}

export default PageSkeleton;
