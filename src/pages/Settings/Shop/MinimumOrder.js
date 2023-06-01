import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../context';

export default function MinimumOrder({ TypoSx, incrementOrder, decrementOrder, current, ...props }) {
  const theme = useTheme();
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { general } = useGlobalContext();
  const currency = general?.currency?.code;

  console.log('currency', currency);
  return (
    <Box sx={props.boxSx}>
      <Typography sx={TypoSx}>Minimum order ({currency})</Typography>
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
          <Button disableRipple sx={{ fontSize: '32px', fontWeight: 600 }} onClick={decrementOrder}>
            -
          </Button>
          <Typography sx={{ fontSize: { lg: '18px', md: '16px', xs: '16px' }, fontWeight: 400, color: '#363636' }}>
            {current}
          </Typography>
          <Button disableRipple sx={{ fontSize: '32px' }} onClick={incrementOrder}>
            +
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
