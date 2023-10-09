import React from 'react';
import Taglist from '../../../components/Common/Taglist';
import { successMsg } from '../../../helpers/successMsg';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';
import { addNewBundleItem } from './helpers';

function SettingsWithBundle({
  title,
  newAppSettings,
  setNewAppSettings,
  setHasChanged,
  objectKey,

  bundleType = 'number',
  limit = 2,
}) {
  return (
    <StyledBox title={title}>
      <Taglist
        listContainerSx={{
          mb: 2.5,
          mt: 2,
        }}
        addButtonLabel="Add"
        type={bundleType}
        items={newAppSettings[objectKey] || []}
        onAdd={(value) => {
          if (limit === 'infinity') {
            addNewBundleItem(value, setNewAppSettings, newAppSettings[objectKey], objectKey, setHasChanged, bundleType);
            return;
          }
          if (newAppSettings[objectKey]?.length <= limit && limit !== 'infinity') {
            addNewBundleItem(value, setNewAppSettings, newAppSettings[objectKey], objectKey, setHasChanged, bundleType);
          } else {
            successMsg('Maximum 3 items can add');
          }
        }}
        onDelete={(item) => {
          setHasChanged(true);
          setNewAppSettings((prev) => ({
            ...prev,
            [objectKey]: prev?.[objectKey].filter((value) => value !== item),
          }));
        }}
      />
    </StyledBox>
  );
}

export default SettingsWithBundle;
