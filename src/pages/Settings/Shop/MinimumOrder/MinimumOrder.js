import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// incrementOrder={incrementOrder} decrementOrder={decrementOrder} current={minimumOrder}
export default function MinimumOrder({ TypoSx, incrementOrder, decrementOrder, current }) {
  const theme = useTheme();

  return (
    <Box>
      <Typography sx={TypoSx}>Minimum order ($USD)</Typography>
      <Box
        sx={{
          marginTop: '15px',
          height: '48px',
          width: '157px',
          padding: '20px 0px',
          borderRadius: '25px',
          background: theme.palette.background.secondary,
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
          <Button sx={{ fontSize: '32px', fontWeight: 600 }} onClick={decrementOrder}>
            -
          </Button>
          <Typography sx={{ fontSize: '32px', fontWeight: 400, color: '#363636' }}>{current}</Typography>
          <Button sx={{ fontSize: '32px' }} onClick={incrementOrder}>
            +
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
