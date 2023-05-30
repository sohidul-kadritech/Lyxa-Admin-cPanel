const statusOptions = ['active', 'inactive', 'suspended'];

export const pastTickets = (size) => {
  const items = [];

  for (let i = 0; i < size; i++) {
    items.push({
      _id: i,
      user: { name: 'Karina Clark', orderId: 'OrderID #455516' },
      shop: { name: 'Karina Clark' },
      rider: { name: 'Karina Clark' },
      createdAt: 'Sep 9, 2020',
      time: '7:15 PM',
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      zone: 'Tegaon',
    });
  }

  return items;
};
