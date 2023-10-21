import React from 'react';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import IncrementDecrementButton from '../IncrementDecrementButton';

function SettingsWithIncrementDecrementButton({
  title,
  tooltip,
  objectKey,
  newAppSettings = { [objectKey]: '' },
  setNewAppSettings,
  setHasChanged,
  action,
  endAdornment,
}) {
  const { incrementHandler, decrementHandler } = action;
  return (
    <StyledBox title={<TitleWithToolTip title={title} tooltip={tooltip} />}>
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
        currentValue={Object.hasOwn(newAppSettings, objectKey) ? newAppSettings[objectKey] : ''}
      />
    </StyledBox>
  );
}

export default SettingsWithIncrementDecrementButton;
