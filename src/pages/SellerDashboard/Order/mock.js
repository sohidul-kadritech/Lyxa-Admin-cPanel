export const shopsList = (items) => {
  const shops = [];

  for (let i = 0; i < items; i++) {
    shops.push({
      rowNumber: i + 1,
      _id: i,
      shopName: 'Mcdonald’s - Branch 1',
      orders: 64,
      avgTime: 64,
      rating: 4.2,
      profit: 440,
    });
  }

  return shops;
};
