import { Box, Skeleton, Stack, useTheme } from '@mui/material';
import React from 'react';

function Row({ theme }) {
  return (
    <Box
      sx={{ padding: 2, borderRadius: '7px', border: `1px solid ${theme.palette.custom.border}`, cursor: 'pointer' }}
    >
      <Stack direction="row" alignItems="flex-start" gap={3}>
        <Skeleton sx={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <Stack flex={1} sx={{ marginTop: '0px' }} gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Skeleton sx={{ width: '150px', height: '12px' }} />
            <Skeleton sx={{ width: '80px', height: '8px' }} />
          </Stack>
          <Skeleton sx={{ width: '200px', height: '10px' }} />
          <Skeleton sx={{ width: '200px', height: '10px' }} />
        </Stack>
      </Stack>
    </Box>
  );
}

function NotificationSekeleton() {
  const theme = useTheme();
  return (
    <Stack gap={2.5}>
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
      <Row theme={theme} />
    </Stack>
  );
}

export default NotificationSekeleton;
