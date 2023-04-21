import { Box, Typography } from '@mui/material';

export default function StyledBox({ title, children }) {
  return (
    <Box
      sx={{
        padding: '25px 30px 20px 30px',
        background: '#fff',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        pb={4}
        sx={{
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '20px',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
