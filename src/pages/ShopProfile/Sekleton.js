import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

export default function ShopProfileSkeleton() {
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          paddingTop: '45px',
          columnGap: '100px',
        }}
      >
        <Box>
          <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: '7px' }}></Skeleton>
          <Stack flexDirection="row" gap="21px" alignItems="center">
            <Skeleton variant="circular" width={175} height={175} sx={{ marginTop: '18px' }}></Skeleton>
            <Box>
              <Skeleton variant="rectangle" width={500} height={25} sx={{ marginTop: '18px' }}></Skeleton>
              <Skeleton variant="rectangle" width={500} height={25} sx={{ marginTop: '18px' }}></Skeleton>
              <Skeleton variant="rectangle" width={500} height={25} sx={{ marginTop: '18px' }}></Skeleton>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Stack flexDirection="column" gap="50px">
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>{' '}
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
            <Box>
              <Skeleton
                variant="rectangular"
                height={13}
                width="100%"
                sx={{ marginBottom: '15px', borderRadius: '7px' }}
              />
              <Skeleton variant="rectangular" height={25} width="100%" sx={{ borderRadius: '7px' }} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
