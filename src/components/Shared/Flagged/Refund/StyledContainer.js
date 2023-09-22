import { Stack, useTheme } from '@mui/material';
import React from 'react';

function StyledContainer({ children }) {
  const theme = useTheme();
  return (
    <Stack
      gap={2}
      sx={{
        background: theme.palette.background.secondary,
        padding: '12px 18px',
        borderRadius: '10px',
        flex: 1,
        minHeight: '182px',
      }}
    >
      {children}
    </Stack>
  );
}

export default StyledContainer;
