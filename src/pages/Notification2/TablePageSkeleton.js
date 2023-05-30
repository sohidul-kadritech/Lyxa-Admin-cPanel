import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

// eslint-disable-next-line no-unused-vars

function generateArray(n) {
  const arr = Array.from({ length: n }, (_, index) => index + 1);
  console.log('generate array: n', arr);
  return arr;
}

// eslint-disable-next-line no-unused-vars
function TablePageSkeleton({ row, column, gap = '30px' }) {
  return (
    <Box>
      <Stack flexDirection="row" gap={gap} marginBottom="30px">
        {generateArray(column).map((item, i) => {
          console.log(i);
          return <Skeleton sx={{ flex: '1' }} key={i} width="150px" height="40px" />;
        })}
      </Stack>
      <Stack gap={gap}>
        {generateArray(row).map((item, i) => {
          console.log(i);
          return (
            <Stack flexDirection="row" gap={gap}>
              {generateArray(column).map((item, i) => {
                console.log(i);
                return <Skeleton sx={{ flex: '1' }} key={i} width="150px" height="30px" />;
              })}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

export default TablePageSkeleton;
