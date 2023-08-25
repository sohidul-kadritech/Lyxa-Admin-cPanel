import React from 'react';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from '../IncrementDecrementButton';

function SettingsWithIncrementDecrementButton({
  title,
  objectKey,
  newAppSettings,
  setNewAppSettings,
  setHasChanged,
  action,
  endAdornment,
}) {
  const { incrementHandler, decrementHandler } = action;
  return (
    <StyledBox title={title}>
      <IncrementDecrementButton
        endAdornment={endAdornment}
        dynamicWidth
        isChangeOthers
        changeOthers={() => {
          setHasChanged(true);
        }}
        incrementHandler={(setValue, key) => {
          incrementHandler(setValue, key, setHasChanged);
        }}
        decrementHandler={(setValue, key) => {
          decrementHandler(setValue, key, setHasChanged);
        }}
        objectKey={objectKey}
        setValue={setNewAppSettings}
        isValidateType={false}
        currentValue={newAppSettings[objectKey]}
      />
    </StyledBox>
  );
}

export default SettingsWithIncrementDecrementButton;
