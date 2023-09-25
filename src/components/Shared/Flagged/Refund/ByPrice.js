import { Stack } from '@mui/material';
import React from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';

function ByPrice({ flaggData, setFlaggData }) {
  console.log('flaggData setFlaggData', { flaggData, setFlaggData });
  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: flaggData?.partialPayment?.shop,
            type: 'number',
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: flaggData?.partialPayment?.adminOrderRefund,
            type: 'number',
          }}
        />
      </StyledInputForRefundPercentage>
      {/* Lyxa delivery profit */}
      <StyledInputForRefundPercentage title="Lyxa Delivery Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: flaggData?.partialPayment?.adminDeliveryRefund,
            type: 'number',
          }}
        />
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPrice;
