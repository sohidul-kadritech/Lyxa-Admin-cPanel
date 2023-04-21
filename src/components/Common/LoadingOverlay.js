import { Box } from '@mui/material';

export default function LoadingOverlay({ sx, ...props }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        width: '100%',
        background: 'rgba(255, 255, 255, .6)',
        zIndex: '9999',
        borderRadius: '7px',
        ...(sx || {}),
      }}
      {...props}
    ></Box>
  );
}
