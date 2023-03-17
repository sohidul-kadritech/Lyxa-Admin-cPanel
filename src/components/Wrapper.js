import { Box } from '@mui/material';
// thrid party

export default function Wrapper({ children, sx, ...props }) {
  return (
    <Box
      sx={{
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#fbfbfb',
        height: '100vh',
        overflowY: 'hidden',
        ...(sx || {}),
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
