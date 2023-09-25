import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function StyledInputForRefundPercentage({ title, children, sx }) {
  const theme = useTheme();
  return (
    <Stack gap={2.5} sx={{ ...(sx || {}) }}>
      <Typography sx={{ fontSize: '15px', fontWeight: 500, lineHeight: '18.15px', color: theme.palette.text.primary }}>
        {title}
      </Typography>
      <Stack>{children}</Stack>
    </Stack>
  );
}

export default StyledInputForRefundPercentage;
