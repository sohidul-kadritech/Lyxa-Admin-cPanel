import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../context';
import IncrementDecrementButton from '../../ReferFriend/IncrementDecrementButton';

export default function MinimumOrder({
  TypoSx,
  incrementOrder,
  decrementOrder,
  setHasChanged,
  setValue,
  current = 0,
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
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
        }}
      >
        {/* <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
          <Button disableRipple sx={{ fontSize: '32px', fontWeight: 600 }} onClick={decrementOrder}>
            -
          </Button>
          <Typography sx={{ fontSize: { lg: '18px', md: '16px', xs: '16px' }, fontWeight: 400, color: '#363636' }}>
            {current}
          </Typography>
          <Button disableRipple sx={{ fontSize: '32px' }} onClick={incrementOrder}>
            +
          </Button>
        </Stack> */}

        <IncrementDecrementButton
          currentValue={current}
          setValue={setValue}
          incrementHandler={incrementOrder}
          decrementHandler={decrementOrder}
          setTypeValidation={setHasChanged}
        />
      </Box>
    </Box>
  );
}
