import { Grid, Skeleton, Stack } from '@mui/material';
import React from 'react';

function PageSkeletonForShop() {
  return (
    <Stack>
      <Grid container spacing={7.5} pb={3} pt={7.5}>
        <Grid item sm={12} md={12} lg={12}>
          <Stack direction="row" justifyContent="flex-end" gap={20 / 4}>
            <Skeleton width="100%" height="40px" sx={{ borderRadius: 7, flex: 1 }} />
            <Skeleton width="250px" height="40px" sx={{ borderRadius: 7 }} />
            <Skeleton width="250px" height="40px" sx={{ borderRadius: 7 }} />
            <Skeleton width="250px" height="40px" sx={{ borderRadius: 7 }} />
          </Stack>
        </Grid>
        <Grid item sm={6} md={4} lg={4}>
          <Skeleton width="100%" height="110px" />
        </Grid>
        <Grid item sm={6} md={4} lg={4}>
          <Skeleton width="100%" height="110px" />
        </Grid>
        <Grid item sm={6} md={4} lg={4}>
          <Skeleton width="100%" height="110px" />
        </Grid>
      </Grid>

      <Grid container spacing={3} pb={7.5} pt={3} mt={3}>
        <Grid item sm={12} md={12} lg={12}>
          <Skeleton width="100%" height="40px" />
        </Grid>
        <Grid item sm={12} md={12} lg={12}>
          <Skeleton width="100%" height="40px" />
        </Grid>
        <Grid item sm={12} md={12} lg={12}>
          <Skeleton width="100%" height="40px" />
        </Grid>
        <Grid item sm={12} md={12} lg={12}>
          <Skeleton width="100%" height="40px" />
        </Grid>
        <Grid item sm={12} md={12} lg={12}>
          <Skeleton width="100%" height="40px" />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default PageSkeletonForShop;
