import { Stack, useTheme } from '@mui/material';
import React from 'react';

import StyledInput from '../StyledInput';

function StyledDateInput({ inputProps }) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        borderRadius: '30px',
        background: theme.palette.background.secondary,
      }}
    >
      <StyledInput
        {...(inputProps || { value: '11/22/2002' })}
        sx={{
          borderRadius: '0px',
          '& input': {
            paddingLeft: '18px',
            paddingRight: '4px',
            paddingTop: '4px',
            paddingBottom: '4px',
            fontWeight: '500',
            fontSize: '12px',
            textAlign: 'right',

            color: theme.palette.text.primary,
            ...(inputProps?.sx || {}),
          },
        }}
      />
      -
      <StyledInput
        {...(inputProps || { value: '11/22/2002' })}
        sx={{
          '& input': {
            paddingLeft: '4px',
            paddingRight: '18px',
            paddingTop: '4px',
            paddingBottom: '4px',
            fontWeight: '500',
            fontSize: '12px',
            textAlign: 'left',
            color: theme.palette.text.primary,
            ...(inputProps?.sx || {}),
          },
        }}
      />
    </Stack>
  );
}

export default StyledDateInput;
