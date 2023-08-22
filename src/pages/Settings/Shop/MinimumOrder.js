import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../context';
import IncrementDecrementButton from '../../ReferFriend/IncrementDecrementButton';

export default function MinimumOrder({
  TypoSx,
  endAdornment,
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
  const currency = general?.currency?.symbol;

  return (
    <Box sx={props.boxSx}>
      <Typography sx={TypoSx}>Minimum Order ({currency})</Typography>
      <Box
        sx={{
          marginTop: '15px',
        }}
      >
        <IncrementDecrementButton
          endAdornment={currency}
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
