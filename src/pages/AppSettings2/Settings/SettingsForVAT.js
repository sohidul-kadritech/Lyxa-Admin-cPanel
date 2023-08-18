import React from 'react';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from '../IncrementDecrementButton';
import { decrementByOneHandler, incrementByOneHandler } from '../helpers';

function SettingsForVAT({ newAppSettings, setNewAppSettings, setHasChanged }) {
  return (
    <StyledBox title="VAT (Percentage)">
      <IncrementDecrementButton
        isChangeOthers
        changeOthers={() => {
          setHasChanged(true);
        }}
        isValidateType={false}
        incrementHandler={(setValue, key) => {
          incrementByOneHandler(setValue, key, setHasChanged);
        }}
        decrementHandler={(setValue, key) => {
          decrementByOneHandler(setValue, key, setHasChanged);
        }}
        objectKey="vat"
        setValue={setNewAppSettings}
        currentValue={newAppSettings?.vat}
      />
    </StyledBox>
  );
}

export default SettingsForVAT;
