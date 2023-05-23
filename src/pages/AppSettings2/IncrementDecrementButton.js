import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function IncrementDecrementButton({
  currentValue,
  incrementHandler,
  decrementHandler,
  setValue,
  setType,
  types,
  type,
  setTypeValidation,
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        marginTop: '6px',
        padding: '20px 0px',
        borderRadius: '25px',
        background: theme.palette.background.secondary,
        display: 'inline-block',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
          <Button
            disableRipple
            sx={{ fontSize: '32px', fontWeight: 600 }}
            onClick={() => {
              decrementHandler(setValue);
              setTypeValidation(types, setType, type);
            }}
          >
            -
          </Button>
          <Typography
            sx={{
              marginLeft: '0 !important',
              fontSize: { lg: '18px', md: '16px', xs: '16px' },
              fontWeight: 400,
              color: '#363636',
            }}
          >
            {currentValue}
          </Typography>
          <Button
            disableRipple
            sx={{ fontSize: '32px', marginLeft: '0 !important' }}
            onClick={() => {
              incrementHandler(setValue);
              setTypeValidation(types, setType, type);
            }}
          >
            +
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default IncrementDecrementButton;
