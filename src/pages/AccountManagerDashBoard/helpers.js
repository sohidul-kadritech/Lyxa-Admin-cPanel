export const staticSellers = [
  {
    _id: '1',
    name: 'All Sellers',
  },
  {
    _id: '2',
    name: 'Sohidul.Co',
  },
  {
    _id: '3',
    name: 'Adam Seller',
  },
];

export const getShopRankedData = (data) =>
  data?.map((item, i) => ({ ...item, seller: { name: item?.sellerName }, _id: i }));
