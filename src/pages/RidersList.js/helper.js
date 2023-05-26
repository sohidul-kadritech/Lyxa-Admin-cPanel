export const queryParamsInit = {
  searchKey: '',
  startDate: '',
  endDate: '',
  sort: '',
  currentPage: 1,
  pageSize: 25,
  status: '',
};

export const statusColorVariants = {
  active: {
    color: '#417C45',
    background: '#DCFCE7',
  },

  inactive: {
    color: '#FFAB09',
    background: 'rgba(255, 176, 23, 0.2)',
  },

  busy: {
    color: '#DD5B63',
    background: '#FEE2E2',
  },

  offline: {
    color: '#363636',
    background: 'rgba(0, 0, 0, 0.2)',
  },
};
