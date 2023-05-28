export const getMockTrx = (length) => {
  const items = [];

  for (let i = 0; i < length; i++) {
    items?.push({
      _id: i,
      autoGenId: '#4145676',
      amount: '$40',
      type: 'Cash',
      date: 'Sep 9, 2020',
      time: '7:15 AM',
      admin: 'Account',
    });
  }

  return items;
};
