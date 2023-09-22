import { Stack } from '@mui/material';
import React from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';

function ByPercentage() {
  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              //   value: 0,
              type: 'number',
            }}
          />
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              //   value: 0,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              //   value: 0,
              type: 'number',
            }}
          />
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              //   value: 0,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Delivery Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              value: 0,
            }}
          />
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              value: 0,
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPercentage;
