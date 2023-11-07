import { East } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import React from 'react';

function OptionsCards({ option }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        padding: '8px 8px',
        cursor: 'pointer',
        borderRadius: '7px',
        transition: 'all 0.3s linear',
        '&:hover': {
          background: '#f0f3f6',
        },
      }}
      onClick={() => {
        if (option?.onClick) {
          option?.onClick();
        }
      }}
    >
      <Stack direction="row" alignItems="center" gap={2.5}>
        <Stack>{option?.icon}</Stack>
        <Stack>
          <Typography>{option?.name}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <East />
      </Stack>
    </Stack>
  );
}

export default OptionsCards;
