import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function StyledInputBox({ children, title }) {
  const theme = useTheme();
  return (
    <Box>
      <Stack>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, lineHeight: '24px', color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Stack>{children}</Stack>
      </Stack>
    </Box>
  );
}

export default StyledInputBox;
