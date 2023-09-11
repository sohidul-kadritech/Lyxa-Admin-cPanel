export const getPayoutType = {
  firstDayOfWeek: 'firstDayOfWeek',
  overDuePeriod: 'overDuePeriod',
};

export const validatePayoutType = (type, oldTypes) => {
  if (oldTypes?.includes(type)) {
    return false;
  }
  return true;
};
