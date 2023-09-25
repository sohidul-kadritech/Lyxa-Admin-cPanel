import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledSwitch from '../../../../components/Styled/StyledSwitch';

export function ShopAction({ actionSx, title, action, isChecked, showSwitch, children, gapValue }) {
  const [value, setValue] = useState(isChecked);

  return (
    <Stack sx={actionSx} direction="row" justifyContent="space-between" alignItems="center" gap={gapValue}>
      {title && (
        <Box>
          <Typography>{title}</Typography>
        </Box>
      )}

      {children}
      {showSwitch && (
        <Box>
          <StyledSwitch
            checked={value}
            onChange={() => {
              setValue(action(value, title));
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
