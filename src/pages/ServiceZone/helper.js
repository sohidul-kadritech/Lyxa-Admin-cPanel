import { successMsg } from '../../helpers/successMsg';

export const validateEditedData = (data) => {
  if (!data?.zoneName) {
    successMsg('Please add a zone name!');
    return false;
  }
  if (!data?.zoneArea) {
    successMsg('Please add a zone area!');
    return false;
  }
  if (!data?.zoneStatus) {
    successMsg('Please select a zone status!');
    return false;
  }
  if (data?.zoneGeometry?.coordinates[0].length === 0) {
    successMsg('Please select a polygon!');
    return false;
  }

  return true;
};
