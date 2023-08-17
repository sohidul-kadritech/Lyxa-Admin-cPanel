import React from 'react';
import Taglist from '../../../components/Common/Taglist';
import { successMsg } from '../../../helpers/successMsg';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';

function SettingsForDeliveryBoySearchArea({ newAppSettings, setNewAppSettings, setHasChanged, addNewBundleItem }) {
  return (
    <StyledBox title="Delivery Boy Search Area (KM)">
      <Taglist
        listContainerSx={{
          mb: 2.5,
          mt: 2,
        }}
        addButtonLabel="Add"
        items={newAppSettings?.searchDeliveryBoyKm || []}
        onAdd={(value) => {
          if (newAppSettings?.searchDeliveryBoyKm?.length <= 2) {
            addNewBundleItem(
              value,
              setNewAppSettings,
              newAppSettings?.searchDeliveryBoyKm,
              // eslint-disable-next-line prettier/prettier
              'searchDeliveryBoyKm',
            );
          } else {
            successMsg('Maximum 3 items can add ');
          }
        }}
        onDelete={(item) => {
          setHasChanged(true);
          setNewAppSettings((prev) => ({
            ...prev,
            searchDeliveryBoyKm: prev?.searchDeliveryBoyKm.filter((value) => value !== item),
          }));
        }}
      />
    </StyledBox>
  );
}

export default SettingsForDeliveryBoySearchArea;
