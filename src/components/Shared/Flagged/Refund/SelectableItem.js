/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import StyledSwitch from '../../../Styled/StyledSwitch';
import CustomeCheckedBox from '../CustomeCheckedBox';

function SelectableItem({ label, price, isChecked, onChange, showToggle = false }) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const { appSetting } = general;

  const { baseCurrency } = appSetting;

  return (
    <Box>
      <Stack direction="row" gap={2.5} width="100%">
        <Stack direction="row" flex={1} justifyContent="space-between" alignItems="center" width="100%">
          <CustomeCheckedBox label={label} value={isChecked} onChange={onChange} />
          {showToggle && (
            <StyledSwitch
            // checked={value}
            // onChange={() => {
            //   setValue(action(value, title));
            // }}
            />
          )}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography minWidth="40px" variant="body2">
            {baseCurrency?.symbol} {price}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SelectableItem;
