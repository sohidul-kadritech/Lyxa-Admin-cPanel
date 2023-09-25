/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';

const initialData = {
  shop: 0,
  adminOrderRefund: 0,
  adminDeliveryRefund: 0,
};

function ByPercentage({ flaggData, setFlaggData }) {
  console.log('flaggData setFlaggData', { flaggData, setFlaggData });
  const [byPercentage, setByPercentage] = useState(initialData);
  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              type: 'number',
              value: byPercentage?.shop,
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
              value: flaggData?.partialPayment?.shop,
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
              value: flaggData?.partialPayment?.adminOrderRefund,
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
              value: flaggData?.partialPayment?.adminDeliveryRefund,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPercentage;
