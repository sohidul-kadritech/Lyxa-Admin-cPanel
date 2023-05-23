import { successMsg } from '../../helpers/successMsg';

export const validateData = (data) => {
  if (!data?.name) {
    successMsg('Please provide your cancel reason');
    return false;
  }
  return true;
};

export const statusTypeOptions = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
];
