import { Box } from '@mui/material';
// thrid party

export default function Wrapper({ children }) {
  return (
    <Box
      sx={{
        paddingTop: 9,
        paddingLeft: 13,
      }}
    >
      {children}
    </Box>
  );
}
