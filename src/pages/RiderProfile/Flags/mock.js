export const getMockFlags = (n) => {
  const items = [];

  for (let i = 0; i < n; i++) {
    items?.push({
      _id: i,
      orderId: '#12855',
      date: 'Sep 9, 2020',
      time: '7:15 AM',
      comment: 'Satisfied',
    });
  }

  return items;
};
