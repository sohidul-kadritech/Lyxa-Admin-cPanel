import moment from 'moment';

export const calculatePaidVat = (total, unpaid) => total - unpaid;

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
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(30, 'd').format('YYYY-MM-DD'),
};
