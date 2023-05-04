import { Box, useTheme } from '@mui/material';
import LoadingOverlay from '../Common/LoadingOverlay';

export default function StyledBox({ children, loading, padding, sx, ...props }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '16px 18px' : '0px',
        ...sx,
      }}
      {...props}
    >
      {loading && <LoadingOverlay />}
      {children}
    </Box>
  );
}
