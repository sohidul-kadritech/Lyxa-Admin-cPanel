/* eslint-disable no-unused-vars */
import { Stack, Typography } from '@mui/material';
import React from 'react';
import StyledBox from './StyledBox';

function MarketingDuration({ marketingData }) {
  return (
    <StyledBox>
      <Stack gap={2.5}>
        <Typography variant="h4">Marketing Duration</Typography>
        <Typography variant="h2">Time</Typography>
      </Stack>
    </StyledBox>
  );
}

export default MarketingDuration;
