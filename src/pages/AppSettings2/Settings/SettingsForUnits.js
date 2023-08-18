import React from 'react';
import Taglist from '../../../components/Common/Taglist';
import StyledBox from '../../Settings/Admin/Marketing/LoyaltySettings/StyledContainer';

/* 
@units - store all units, 
@setUnits - payload units, 
@setDeletedUnitId - store only deleted units Id to pass them to the delete unit api 
@addNewBundleItem - to validate units data and if they are validate it will add units to the units state
*/

function SettingsForUnits({ units, setUnits, setDeletedUnitId, addNewBundleItem, setHasChanged }) {
  return (
    <StyledBox title="Units">
      <Taglist
        listContainerSx={{
          mb: 2.5,
          mt: 2,
        }}
        type="text"
        addButtonLabel="Add"
        items={units.map((u) => u.name) || []}
        onAdd={(value) => {
          setHasChanged(true);
          addNewBundleItem(value, setUnits, units, null, 'text');
        }}
        onDelete={(item) => {
          setHasChanged(true);
          setUnits((prev) => {
            setDeletedUnitId((deletedUnit) => {
              /* finding deleted id here */
              const deletedId = prev.find((value) => value.name === item && value._id);
              /* if there are exist any deleted id and 
              existing deleted id not includes in previous deletedUnitId state then we store deletedId in the state.
              otherwise deletedUnitId remain same */
              if (deletedId && !deletedUnit.includes(deletedId?._id)) return [...deletedUnit, deletedId._id];
              return [...deletedUnit];
            });
            return prev.filter((value) => value.name !== item);
          });
        }}
      />
    </StyledBox>
  );
}

export default SettingsForUnits;
