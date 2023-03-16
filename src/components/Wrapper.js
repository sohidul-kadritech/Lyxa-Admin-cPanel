import { Box } from '@mui/material';
// thrid party

export default function Wrapper({ children }) {
  return (
    <Box
      sx={{
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#E5E5E5',
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      {children}
    </Box>
  );
}
