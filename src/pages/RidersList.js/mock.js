const statusOptions = ['active', 'inactive', 'suspended'];

export const getMockRiders = (size) => {
  const items = [];

  for (let i = 0; i < size; i++) {
    items.push({
      _id: i,
      name: 'Karina Clark',
      autoGenId: 'OrderID #455516',
      shift: Math.random() > 0.5 ? 'Morning' : 'Night',
      rating: 4.2,
      orders: '101',
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      zone: 'Tegaon',
    });
  }

  return items;
};
