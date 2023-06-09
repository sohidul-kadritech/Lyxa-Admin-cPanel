import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function PageSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" width={210} height={60}></Skeleton>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          paddingTop: '45px',
        }}
      >
        <Box sx={{ width: '80%' }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={350}
            sx={{ marginTop: '50px', borderRadius: '7px' }}
          ></Skeleton>
          <Stack flexDirection="row" gap="21px">
            <Skeleton variant="circular" width={175} height={175} sx={{ marginTop: '18px' }}></Skeleton>
            <Box>
              <Skeleton variant="rectangle" width={500} height={30} sx={{ marginTop: '18px' }}></Skeleton>
              <Skeleton variant="rectangle" width={500} height={20} sx={{ marginTop: '18px' }}></Skeleton>
              <Skeleton variant="rectangle" width={500} height={10} sx={{ marginTop: '18px' }}></Skeleton>
              <Skeleton variant="rectangle" width={500} height={10} sx={{ marginTop: '18px' }}></Skeleton>
              <Stack flexDirection="row" gap="16px">
                <Skeleton variant="rectangle" width={132} height={50} sx={{ marginTop: '18px' }}></Skeleton>
                <Skeleton variant="rectangle" width={132} height={50} sx={{ marginTop: '18px' }}></Skeleton>
                <Skeleton variant="rectangle" width={132} height={50} sx={{ marginTop: '18px' }}></Skeleton>
                <Skeleton variant="rectangle" width={132} height={50} sx={{ marginTop: '18px' }}></Skeleton>
              </Stack>
            </Box>
          </Stack>
          <Skeleton variant="rectangle" width={300} height={50} sx={{ marginTop: '60px' }}></Skeleton>
          {/* table */}
          {/* <Skeleton
            variant="rectangle"
            width="100%"
            height={350}
            sx={{ marginTop: '30px', borderRadius: '7px' }}
          ></Skeleton> */}
        </Box>

        <Box sx={{ width: '20%' }}>
          {/* <Skeleton variant="rectangular" width={5} height="90vh" margin></Skeleton> */}
          <Stack flexDirection="column" gap="30px">
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
            <Skeleton variant="rectangular" width={250} height={80} sx={{ marginBottom: '30px' }}></Skeleton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default PageSkeleton;
