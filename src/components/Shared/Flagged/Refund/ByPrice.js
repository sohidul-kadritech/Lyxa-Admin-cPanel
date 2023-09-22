import { Stack } from '@mui/material';
import React from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';

function ByPrice() {
  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            //   value: 0,
            type: 'number',
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            //   value: 0,
            type: 'number',
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Delivery Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: 0,
          }}
        />
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPrice;
