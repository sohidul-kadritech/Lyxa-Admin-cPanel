import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function IncrementDecrementButton({ currentValue, incrementHandler, decrementHandler }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: '6px',
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
        <Button disableRipple sx={{ fontSize: '32px', fontWeight: 600 }} onClick={decrementHandler}>
          -
        </Button>
        <Typography sx={{ fontSize: { lg: '18px', md: '16px', xs: '16px' }, fontWeight: 400, color: '#363636' }}>
          {currentValue}
        </Typography>
        <Button disableRipple sx={{ fontSize: '32px' }} onClick={incrementHandler}>
          +
        </Button>
      </Stack>
    </Box>
  );
}

export default IncrementDecrementButton;
