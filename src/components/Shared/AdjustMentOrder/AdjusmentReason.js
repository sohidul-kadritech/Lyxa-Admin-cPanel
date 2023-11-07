/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React from 'react';
import StyledFormField from '../../Form/StyledFormField';

function AdjusmentReason({ adjuestedOrder, setAdjustedOrder }) {
  return (
    <Stack>
      <StyledFormField
        label="Reason *"
        intputType="text"
        inputProps={{
          placeholder: 'Adjustment reasone',
          value: adjuestedOrder?.adjustmentReason,
          onChange: (e) => setAdjustedOrder((prev) => ({ ...prev, adjustmentReason: e.target.value })),
        }}
      />
    </Stack>
  );
}

export default AdjusmentReason;
