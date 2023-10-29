import { Stack } from '@mui/material';
import React from 'react';
import StyledFormField from '../../Form/StyledFormField';

function AdjusmentReason() {
  return (
    <Stack>
      <StyledFormField
        label="Reason *"
        intputType="text"
        inputProps={{
          placeholder: 'Adjustment reasone',
        }}
      />
    </Stack>
  );
}

export default AdjusmentReason;
