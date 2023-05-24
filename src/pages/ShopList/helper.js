/* eslint-disable no-unused-vars */
export const filtersInit = {
  searchKey: '',
  status: '',
  sort: '',
};

// eslint-disable-next-line default-param-last
export const filterShops = (shops = [], filters) => {
  const temp = [];
  const { searchKey, status } = filters;

  shops?.forEach((shop) => {
    if (searchKey?.trim() && shop?.shopName?.toLowerCase().search(searchKey?.toLowerCase()) === -1) return;
    if (status && shop?.shopStatus !== status) return;
    temp.push(shop);
  });
  return temp;
};
