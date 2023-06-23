import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function Row({ type }) {
  return (
    <Box>
      {type === 'type1' && (
        <Stack gap="10px">
          {/* title */}
          <Skeleton width="250px" height="20px" />

          <Stack direction="row" gap="20px" alignItems="center">
            <Skeleton width="250px" height="16px" />{' '}
            <Skeleton width="150px" sx={{ borderRadius: '20px' }} height="50px" />
          </Stack>
          <Stack direction="row" gap="20px" alignItems="center">
            <Skeleton width="250px" height="16px" />{' '}
            <Skeleton width="150px" sx={{ borderRadius: '20px' }} height="50px" />
          </Stack>
        </Stack>
      )}

      {type === 'type2' && (
        <Stack gap="10px">
          {/* title */}
          <Skeleton width="250px" height="20px" />
          <Stack direction="row" gap="20px" alignItems="center">
            <Skeleton width="150px" sx={{ borderRadius: '20px' }} height="50px" />
          </Stack>
        </Stack>
      )}

      {type === 'type3' && (
        <Stack gap="10px">
          {/* title */}
          <Skeleton width="250px" height="20px" />

          <Stack direction="row" gap="20px" alignItems="center">
            <Skeleton width="80px" sx={{ borderRadius: '20px' }} height="50px" />
            <Skeleton width="80px" sx={{ borderRadius: '20px' }} height="50px" />
            <Skeleton width="80px" sx={{ borderRadius: '20px' }} height="50px" />
            <Skeleton width="80px" sx={{ borderRadius: '20px' }} height="50px" />
            <Skeleton width="80px" sx={{ borderRadius: '20px' }} height="50px" />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

function AppSettingsSkeleton() {
  return (
    <Stack gap="30px">
      {/* butler */}
      <Row type="type1" />
      {/* customer service */}
      <Row type="type2" />
      {/* VAT */}
      <Row type="type2" />
      {/* delivery boy search */}
      <Row type="type3" />
      {/* nearboy shop search */}
      <Row type="type2" />
      {/* nearboy shop distance in Home screen */}
      <Row type="type2" />
      {/* maximum discount for shops */}
      <Row type="type3" />
      {/* unit */}
      <Row type="type3" />
      {/* currency */}
      <Row type="type2" />
    </Stack>
  );
}

export default AppSettingsSkeleton;
