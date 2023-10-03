import { Stack } from '@mui/material';
import React from 'react';
import InputBox from '../../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';

function SettingsForButler({ newAppSettings, setNewAppSettings, setHasChanged }) {
  return (
    <StyledBox title="Butler">
      <Stack gap="10px" justifyContent="center">
        <InputBox
          title="Max total EST items price"
          endAdornment={`${newAppSettings?.baseCurrency?.symbol || ''}`}
          inputValue={`${newAppSettings?.maxTotalEstItemsPriceForButler}`}
          inputType="number"
          sxLeft={{ width: '200px' }}
          sxRight={{ width: '140px' }}
          onInputChange={(e) => {
            setHasChanged(true);
            setNewAppSettings((prev) => ({ ...prev, maxTotalEstItemsPriceForButler: e?.target?.value }));
          }}
        />
        <InputBox
          sxLeft={{ width: '200px' }}
          sxRight={{ width: '140px' }}
          title="Maximum Distance"
          endAdornment="KM"
          inputValue={`${newAppSettings?.maxDistanceForButler}`}
          inputType="number"
          onInputChange={(e) => {
            setHasChanged(true);
            // setMaxDistanceForButler(e?.target?.value);
            setNewAppSettings((prev) => ({ ...prev, maxDistanceForButler: e?.target?.value }));
          }}
        />
      </Stack>
    </StyledBox>
  );
}

export default SettingsForButler;
