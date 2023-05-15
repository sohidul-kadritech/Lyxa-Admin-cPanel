import { Grid, Skeleton } from '@mui/material';
import React from 'react';

function OperationsPageSkeleton() {
  return (
    <Grid container spacing={4}>
      <Skeleton width="22%" height={120} sx={{ margin: '20px 20px' }}></Skeleton>
      <Skeleton width="22%" height={120} sx={{ margin: '20px 20px' }}></Skeleton>
      <Skeleton width="22%" height={120} sx={{ margin: '20px 20px' }}></Skeleton>
      <Skeleton width="22%" height={120} sx={{ margin: '20px 20px' }}></Skeleton>
      <Skeleton width="22%" height={120} sx={{ margin: '20px 20px' }}></Skeleton>
    </Grid>
  );
}

export default OperationsPageSkeleton;
