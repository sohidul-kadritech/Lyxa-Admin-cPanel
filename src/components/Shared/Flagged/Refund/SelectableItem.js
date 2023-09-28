/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../../context';
import StyledSwitch from '../../../Styled/StyledSwitch';
import CustomeCheckedBox from '../CustomeCheckedBox';

function SelectableItem({ label, price, isChecked, onChange, showToggle = false, showPrice = true, onChangeToggle }) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const { appSetting } = general;

  const [isToggled, setIsToggled] = useState(true);

  const { baseCurrency } = appSetting;

  return (
    <Box>
      <Stack direction="row" gap={2.5} width="100%">
        <Stack direction="row" flex={1} justifyContent="space-between" alignItems="center" width="100%">
          <CustomeCheckedBox label={label} value={isChecked} onChange={onChange} />
          {showToggle && (
            <StyledSwitch
              size="small"
              sx={{
                width: 40,
                height: 20,
                '& .MuiSwitch-switchBase': {
                  margin: '1px 2px 2px 2px',
                  '&.Mui-checked': {
                    transform: 'translateX(19px)',
                  },
                },
                '& .MuiSwitch-thumb': {
                  boxSizing: 'border-box',
                  width: 18,
                  height: 18,
                },
              }}
              checked={isToggled}
              onChange={() => {
                setIsToggled((prev) => {
                  if (onChangeToggle) onChangeToggle(!prev);
                  return !prev;
                });
              }}
            />
          )}
        </Stack>
        {showPrice && (
          <Stack direction="row" alignItems="center">
            <Typography minWidth="40px" variant="body2">
              {baseCurrency?.symbol} {price}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default SelectableItem;
