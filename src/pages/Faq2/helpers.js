import moment from 'moment';

export const dateRangeInit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export const sortOptions = [
  {
    value: 'desc',
    label: 'Desc',
  },
  {
    value: 'asc',
    label: 'Asc',
  },
];
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

export const supportTypeOptions = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'accountSupport',
    label: 'Account Support',
  },
  {
    value: 'orderSupport',
    label: 'Order Support',
  },
  {
    value: 'faq',
    label: 'FAQ',
  },
];

// type value
export const getTypeValue = (type) => {
  switch (type) {
    case 'user':
      return 'User FAQ';

    case 'shop':
      return 'Shop FAQ';

    case 'deliveryBoy':
      return 'Rider FAQ';

    case 'accountSupport':
      return 'Account Support';

    case 'orderSupport':
      return 'Order Support';

    default:
      return '';
  }
};
