/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import StyledSwitch from '../../../Styled/StyledSwitch';
import CustomeCheckedBox from '../CustomeCheckedBox';

function SelectableItem({ label, price, isChecked, onChange }) {
  const theme = useTheme();
  return (
    <Box>
      <Stack direction="row">
        <CustomeCheckedBox sx={{ flex: 1 }} label={label} value={isChecked} onChange={onChange} />{' '}
        <Stack direction="row" gap={2.5} alignItems="center">
          <StyledSwitch
          // checked={value}
          // onChange={() => {
          //   setValue(action(value, title));
          // }}
          />
          <Typography variant="body2">$ {price}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SelectableItem;
