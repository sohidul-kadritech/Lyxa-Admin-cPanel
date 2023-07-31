export const getMockData = () => {
  const rows = [];

  for (let i = 0; i < 10; i++) {
    rows?.push({
      user: {
        name: 'J. Doe',
      },
      shop: {
        name: 'Kfc',
      },
      rating: 3.7,
      _id: `${i}`,
    });
  }

  return rows;
};
