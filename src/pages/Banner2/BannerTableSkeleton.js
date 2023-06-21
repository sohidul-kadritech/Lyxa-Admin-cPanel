import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

function generateArray(n) {
  const arr = Array.from({ length: n }, (_, index) => index + 1);
  console.log('generate array: n', arr);
  return arr;
}

function Row({ row, gap = '16px' }) {
  return (
    <Stack flexDirection="row" gap={gap} alignItems="center" justifyContent="space-between">
      {generateArray(row).map((item, i) => {
        console.log(i);
        if (i === 0) {
          return <Skeleton key={i} width="117px" height="46px" />;
        }
        return <Skeleton key={i} width="117px" height="20px" />;
      })}
    </Stack>
  );
}

function BannerTableSkeleton({ column, row, gap = '16px' }) {
  return (
    <Box sx={{ padding: '7.5px 16px  2px' }}>
      <Stack flexDirection="row" gap={gap} marginBottom="20px" justifyContent="space-between">
        {generateArray(column).map((item, i) => {
          console.log(i);
          return <Skeleton key={i} width="117px" height="30px" />;
        })}
      </Stack>
      <Stack gap={gap}>
        {generateArray(row).map((item, i) => (
          <Row key={i} row={column} />
        ))}
      </Stack>
    </Box>
  );
}

export default BannerTableSkeleton;
