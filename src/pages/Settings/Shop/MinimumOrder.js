/* eslint-disable max-len */
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
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
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  return (
    <Box sx={props.boxSx}>
      <Typography sx={TypoSx}>
        <TitleWithToolTip title="Minimum Order" sx={{ fontSize: '16px', fontWeight: 600 }} />
      </Typography>
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
