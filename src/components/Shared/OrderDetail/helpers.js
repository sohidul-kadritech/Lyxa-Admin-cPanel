import { Box, Typography, useTheme } from '@mui/material';

// Order Details Handling
export function StyledOrderDetailBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
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
