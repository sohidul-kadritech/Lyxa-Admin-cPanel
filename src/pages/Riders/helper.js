export const statusColorVariants = {
  active: {
    color: '#417C45',
    background: '#DCFCE7',
  },

  deactive: {
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

export const riderLiveStatusOptions = [
  {
    value: 'online',
    label: 'Online',
  },
  {
    value: 'offline',
    label: 'Offline',
  },
  {
    value: 'all',
    label: 'All',
  },
];

export const riderStatusOptions = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'deactive',
    label: 'Deactive',
  },
  {
    value: '',
    label: 'All',
  },
];

export const queryParamsInit = {
  page: 1,
  pageSize: 25,
  searchKey: '',
  sortBy: 'desc',
  status: '',
  liveStatus: '',
  shift: '',
  zoneId: '',
  deliveryBoyType: '',
  shopId: '',
};
