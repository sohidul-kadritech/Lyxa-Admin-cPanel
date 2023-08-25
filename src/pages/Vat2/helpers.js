import moment from 'moment';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';

export const calculatePaidVat = (total, unpaid) => {
  const paidVat = total - unpaid;
  const result = (paidVat || 0).toFixed(2);
  return result;
};

// eslint-disable-next-line prettier/prettier
export const getAllAdminOptions = (admin) => {
  console.log('admin', admin);
  const generatedOption = admin.map(({ name, _id }) => ({ label: name, value: _id }));

  if (generatedOption.length > 0) return generatedOption;
  return [{ label: 'No Admin Found', value: '' }];
};

export const vatTrxsAmountFilterOptions = [
  { label: 'Select Type', value: '' },
  { label: 'Less Then', value: '<' },
  { label: 'Greater Then', value: '>' },
  { label: 'Equal', value: '=' },
];

export const dateRangeInit = {
  end: moment(),
  start: getFirstMonday('week'),
};
