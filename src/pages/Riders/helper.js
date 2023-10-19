import { successMsg } from '../../helpers/successMsg';

export const riderStatusColorVariants = {
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

  available: {
    color: '#417C45',
    background: '#DCFCE7',
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

export const riderType = [
  {
    value: 'dropRider',
    label: 'Drop Rider',
  },
  {
    value: 'shopRider ',
    label: 'Shop Rider',
  },
];

export const getQueryParamsInit = (viewUserType, shopId) => {
  const obj = {
    page: 1,
    pageSize: 25,
    searchKey: '',
    sortBy: 'desc',
    status: '',
    liveStatus: '',
    shift: '',
    zoneId: 'all',
    deliveryBoyType: viewUserType === 'admin' ? 'dropRider' : 'shopRider ',
    shopId: viewUserType === 'shop' ? shopId : undefined,
  };

  if (shopId && viewUserType !== 'admin') obj.shopId = shopId;

  return obj;
};

export const getRiderStatus = (rider) => {
  if (rider?.status === 'deactive') return 'deactive';
  if (rider?.liveStatus === 'offline') return 'offline';
  if (rider?.availability) return 'available';
  if (!rider?.availability) return 'busy';
  if (rider?.liveStatus === 'online') return 'online';
  return '';
};

export const getRiderLocation = (lat, lng) => {
  if (lat && lng) {
    return;
  }

  successMsg('Rider not found!', 'warn');
};
