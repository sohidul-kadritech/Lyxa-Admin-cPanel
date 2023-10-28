import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

function StyledAdjustmentOrderContainer({ sx, title, children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        ...(sx || {}),
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export default StyledAdjustmentOrderContainer;
