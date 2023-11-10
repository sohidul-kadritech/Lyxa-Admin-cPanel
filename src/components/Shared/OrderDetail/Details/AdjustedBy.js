/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox } from '../helpers';

function AdjustedBy({ order = {}, sx, showMap = true }) {
  const theme = useTheme();
  return (
    <StyledOrderDetailBox
      sx={sx}
      title={
        <Stack
          direction="row"
          alignContent="center"
          justifyContent="space-between"
          sx={{
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            Adjusted By
          </span>
        </Stack>
      }
    >
      <Typography variant="body2">{order?.adjustOrderRequest?.adjustedBy === 'shop' ? 'Shop' : 'Lyxa'}</Typography>
    </StyledOrderDetailBox>
  );
}

export default AdjustedBy;
