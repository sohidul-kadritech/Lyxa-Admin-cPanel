import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledSwitch from '../../../../components/Styled/StyledSwitch';

export function ShopAction({ actionSx, title, action, isChecked, showSwitch }) {
  const [value, setValue] = useState(isChecked);

  return (
    <Stack sx={actionSx} direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography>{title}</Typography>
      </Box>
      {showSwitch && (
        <Box>
          <Typography>
            <StyledSwitch
              checked={value}
              onChange={() => {
                setValue(action(value, title));
              }}
            />
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
