export const getQueryParamsInit = {
  page: 1,
  pageSize: 20,
  searchKey: '',
  sortBy: 'desc',
  status: '',
  type: 'all',
};

export const adminLogTypeOptions = [
  // App settings
  { label: 'All', value: 'all' },
  { label: 'App Currency', value: 'currency' },
  { label: 'Secondary Currency', value: 'secondaryCurrency' },
  { label: 'Accepted Currency', value: 'acceptedCurrency' },
  { label: 'VAT', value: 'vat' },
  { label: 'Max Discount', value: 'maxDiscount' },
  { label: 'Near By ShopKm', value: 'nearByShopKm' },
  { label: 'Near By ShopKm For User Home Screen', value: 'nearByShopKmForUserHomeScreen' },
  { label: 'Search Delivery Boy Km', value: 'searchDeliveryBoyKm' },
  { label: 'Max Total Est Items For Butler', value: 'maxTotalEstItemsPriceForButler' },
  { label: 'Max Total Est Items For Butler', value: 'maxTotalEstItemsPriceForButler' },
  { label: 'Max Distance For Butler', value: 'maxDistanceForButler' },
  { label: 'Max Customer Service Value', value: 'maxCustomerServiceValue' },
  // percentage settings
  { label: 'Global Lyxa Charge', value: 'globalDropCharge' },
  { label: 'Global Delivery Cut', value: 'globalDeliveryCut' },
  { label: 'Global Delivery Cut For Butler', value: 'globalDeliveryCutForButler' },
  { label: 'Specific Seller Drop Charge', value: 'specificSellerDropCharge' },
  { label: 'Specific Seller Delivery Cut', value: 'specificSellerDeliveryCut' },
  { label: 'Seller Lyxa Charge Reset', value: 'sellerDropChargeReset' },
];

export function dataFilterForAdminLogs(data) {
  const filteredData = data.filter((item) => adminLogTypeOptions.some((option) => option.value === item.type));
  console.log('previous data', data, 'filtered', filteredData);
  return { data: filteredData, totalpage: filteredData.length + 1 };
}
