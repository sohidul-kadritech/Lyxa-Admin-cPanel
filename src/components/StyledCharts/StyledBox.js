import { Box, useTheme } from '@mui/material';
import LoadingOverlay from '../Common/LoadingOverlay';

export default function StyledBox({ children, loading, padding, sx }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '18px 18px 23px 20px' : '0px',
        ...sx,
      }}
    >
      {loading && <LoadingOverlay />}
      {children}
    </Box>
  );
}
