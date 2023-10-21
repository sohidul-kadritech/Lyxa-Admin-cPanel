/* eslint-disable max-len */
import { Stack } from '@mui/material';
import React from 'react';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
import InputBox from '../../Settings/Admin/Marketing/LoyaltySettings/InputBox';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';

function SettingsForButler({ newAppSettings, setNewAppSettings, setHasChanged }) {
  return (
    <StyledBox title="Butler">
      <Stack gap="10px" justifyContent="center">
        <InputBox
          title={
            <TitleWithToolTip
              title="Max total EST items price"
              alignItems="flex-start"
              size="small"
              tooltip="The estimated item price for butler orders that include both a purchase and delivery should be in this range."
            />
          }
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
          title={
            <TitleWithToolTip
              title="Maximum Distance"
              size="small"
              tooltip="If the distance between the delivery to and delivery from addresses falls within this range, a Butler Order is available."
            />
          }
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
