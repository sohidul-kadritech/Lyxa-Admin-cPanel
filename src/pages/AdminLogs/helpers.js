export const getQueryParamsInit = {
  page: 1,
  pageSize: 20,
  searchKey: '',
  sortBy: 'desc',
  status: '',
  type: 'maxDiscount',
};

export const adminLogTypeOptions = [
  { label: 'App Currency', value: 'currency' },
  { label: 'Max Discount', value: 'maxDiscount' },
  { label: 'Near By ShopKm', value: 'nearByShopKm' },
  { label: 'Search Delivery Boy Km', value: 'searchDeliveryBoyKm' },
  { label: 'Global Lyxa Charge', value: 'globalDropCharge' },
  { label: 'Global Delivery Cut', value: 'globalDeliveryCut' },
  { label: 'Specific Seller Drop Charge', value: 'specificSellerDropCharge' },
  { label: 'Specific Seller Delivery Cut', value: 'specificSellerDeliveryCut' },
  { label: 'Seller Lyxa Charge Reset', value: 'sellerDropChargeReset' },
  // { label: 'Max Customer Service Value', value: 'maxCustomerServiceValue' },
];

export function dataFilterForAdminLogs(data) {
  const filteredData = data.filter((item) => adminLogTypeOptions.some((option) => option.value === item.type));
  console.log('previous data', data, 'filtered', filteredData);
  return { data: filteredData, totalpage: filteredData.length + 1 };
}
