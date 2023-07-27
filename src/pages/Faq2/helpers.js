import moment from 'moment';

export const dateRangeInit = {
  end: moment(),
  start: moment().subtract(7, 'd'),
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

export const createUpdateData = (data) => {
  console.log('data', data);

  if (data.ans) {
    return {
      id: data?._id,
      question: data?.question,
      ans: data?.ans,
      type: data?.type,
      status: data?.status,
    };
  }
  if (data?.answer) {
    return {
      id: data?._id,
      question: data?.question,
      answer: data?.answer,
      type: data?.type,
      status: data?.status,
    };
  }

  return {};
};
