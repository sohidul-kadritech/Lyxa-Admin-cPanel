import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

function StyledIncrementDecrementButton({ value = 0 }) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      mt={2.5}
      sx={{
        background: theme.palette.background.secondary,
        borderRadius: '12px',
      }}
    >
      <Button
        disableRipple
        size="small"
        sx={{
          '&.MuiButton-root': {
            minWidth: '30px',
            padding: '4px 8px',
          },
        }}
      >
        <AddIcon sx={{ width: '20px', height: '20px' }} />
      </Button>
      <Typography variant="h5" sx={{ fontSize: '14px', fontWeight: '600' }}>
        {value}
      </Typography>
      <Button
        disableRipple
        size="small"
        sx={{
          '&.MuiButton-root': {
            minWidth: '20px',
            padding: '4px 8px',
          },
        }}
      >
        <RemoveIcon sx={{ width: '20px', height: '20px' }} />
      </Button>
    </Stack>
  );
}

export default StyledIncrementDecrementButton;