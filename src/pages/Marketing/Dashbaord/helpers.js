import moment from 'moment';

// third party
export const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

export const dateRangeItit = {
  end: moment(),
  start: moment().subtract(7, 'd'),
};

export const marketingDurationTime = (start, end) => {
  // if campaign ended
  if (moment().isAfter(moment(end))) return 'During campaign';
  const duration = moment().diff(moment(start), 'hours');
  return `${Math.ceil(duration / 24) || 1} days`;
};
