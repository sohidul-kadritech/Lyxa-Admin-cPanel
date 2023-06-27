import moment from 'moment';

const dateRangeInit = {
  startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
};
export const getQueryParamsInit = {
  page: 1,
  pageSize: 20,
  searchKey: '',
  sortBy: 'desc',
  status: '',
  type: 'all',
  ...dateRangeInit,
};

export const adminLogTypeOptions = [
  // App settings
  { label: 'All', value: 'all' },
  { label: 'App Currency', value: 'currency' },
  { label: 'Secondary Currency', value: 'secondaryCurrency' },
  { label: 'Accepted Currency', value: 'acceptedCurrency' },
  { label: 'VAT', value: 'vat' },
  { label: 'Maximum Discount for Shops', value: 'maxDiscount' },
  { label: 'Shop Distance (KM)', value: 'nearByShopKm' },
  { label: 'Near Shop Distance in Home Screen (KM)', value: 'nearByShopKmForUserHomeScreen' },
  { label: 'Delivery Boy Search Area (KM)', value: 'searchDeliveryBoyKm' },
  { label: 'Max Total EST Items Price for Butler', value: 'maxTotalEstItemsPriceForButler' },
  { label: 'Maximum Distance for Butler', value: 'maxDistanceForButler' },
  { label: 'Lyxa Pay Limit (Customer Service)', value: 'maxCustomerServiceValue' },
  { label: 'Units', value: 'unit' },
  // Percentage settings
  { label: 'Global Lyxa charge (Percentage)', value: 'globalDropCharge' },
  { label: 'Global Delivery Cut', value: 'globalDeliveryCut' },
  { label: 'Global Delivery Cut For Butler', value: 'globalDeliveryCutForButler' },
  { label: 'Specific Seller Lyxa Charge', value: 'specificSellerDropCharge' },
  // { label: 'Specific Seller Delivery Cut', value: 'specificSellerDeliveryCut' },
  // { label: 'Seller Lyxa Charge Reset', value: 'sellerDropChargeReset' },
];

export const getTypeName = (type) => {
  const getData = {
    currency: 'App Currency',
    secondaryCurrency: 'Secondary Currency',
    acceptedCurrency: 'Accepted Currency',
    vat: 'VAT',
    maxDiscount: 'Maximum Discount for Shops',
    nearByShopKm: 'Shop Distance (KM)',
    nearByShopKmForUserHomeScreen: 'Near Shop Distance in Home Screen (KM)',
    searchDeliveryBoyKm: 'Delivery Boy Search Area (KM)',
    maxTotalEstItemsPriceForButler: 'Max Total EST Items Price for Butler',
    maxDistanceForButler: 'Maximum Distance for Butler',
    maxCustomerServiceValue: 'Lyxa Pay Limit (Customer Service)',
    unit: 'Units',
    globalDropCharge: 'Global Lyxa charge (Percentage)',
    globalDeliveryCut: 'Global Delivery Cut',
    globalDeliveryCutForButler: 'Global Delivery Cut for Butler',
    specificSellerDropCharge: 'Specific Seller Lyxa Charge',
    // specificSellerDeliveryCut: 'Specific Seller Delivery Cut',
    sellerDropChargeReset: 'Seller Lyxa Charge Reset',
  };
  return getData[type];
};

export function dataFilterForAdminLogs(data) {
  const filteredData = data.filter((item) => adminLogTypeOptions.some((option) => option.value === item.type));
  console.log('previous data', data, 'filtered', filteredData);
  return { data: filteredData, totalpage: filteredData.length + 1 };
}
