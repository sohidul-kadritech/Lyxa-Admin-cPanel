import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';

function SellerPageSkeleton() {
  return (
    <Box>
      <Stack direction="row" gap="22px">
        <Box sx={{ width: '278px', borderRadius: '7px', marginTop: '42px' }}>
          <Skeleton width="100%" height="550px" />
        </Box>
        <Box flex={1}>
          <Box
            sx={{
              padding: '44px 40px 38px',
              borderRadius: '7px',
            }}
          >
            <Box>
              <Stack direction="row" gap="25px" flexWrap="wrap">
                <Skeleton width="100px" height="100px" sx={{ borderRadius: '50%' }} />
                <Stack flex={1}>
                  <Stack flex={1} direction="row" alignItems="center">
                    <Stack flex={1} direction="row" alignItems="center" gap="16px">
                      <Skeleton width="350px" height="40px" />
                      <Skeleton width="250px" height="40px" />
                    </Stack>
                    <Skeleton width="40px" height="40px" sx={{ borderRadius: '50%' }} />
                  </Stack>
                  <Stack direction="row" gap="16px" flexWrap="wrap">
                    <Skeleton width="250px" height="30px" />
                    <Skeleton width="250px" height="30px" />
                    <Skeleton width="250px" height="30px" />
                  </Stack>
                </Stack>
              </Stack>
              <Box marginTop="40px">
                <Skeleton width="100%" height="40px" />
              </Box>
              <Box marginTop="30px">
                <TablePageSkeleton row={5} column={5} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default SellerPageSkeleton;
