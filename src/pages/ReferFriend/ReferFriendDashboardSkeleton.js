import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

function ReferFriendDashboardSkeleton() {
  return (
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2.25, sm: 3.25, md: 6.5 }}>
        <Grid item xs={6} md={4}>
          <Skeleton height="100px" sx={{ borderRadius: '7px' }}></Skeleton>
        </Grid>
        <Grid item xs={6} md={4}>
          <Skeleton height="100px" sx={{ borderRadius: '7px' }}></Skeleton>
        </Grid>

        <Grid item xs={6} md={4}>
          <Skeleton height="100px" sx={{ borderRadius: '7px' }}></Skeleton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReferFriendDashboardSkeleton;
