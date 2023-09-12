export const staticData = [
  {
    _id: 1,
    name: 'Restaurent Name',
    image: 'https://freeaiavatargenerator.pro/wp-content/uploads/2023/03/ai-generated-gebca0d715_1920.jpg',
    autoGenId: '#4552222',
    createdAt: 'April 4, 2020',
    dueDate: 'April 17, 2020',
    seller: {
      company_name: 'Seller Name',
    },
    amount: 440,
  },
  {
    _id: 2,
    name: 'Restaurent Name',
    image: 'https://freeaiavatargenerator.pro/wp-content/uploads/2023/03/ai-generated-gebca0d715_1920.jpg',
    autoGenId: '#4552222',
    createdAt: 'April 4, 2020',
    dueDate: 'April 17, 2020',
    seller: {
      company_name: 'Seller Name',
    },
    amount: 240,
  },
  {
    _id: 3,
    name: 'Restaurent Name',
    image: 'https://freeaiavatargenerator.pro/wp-content/uploads/2023/03/ai-generated-gebca0d715_1920.jpg',
    autoGenId: '#4552222',
    createdAt: 'April 4, 2020',
    dueDate: 'April 17, 2020',
    seller: {
      company_name: 'Seller Name',
    },
    amount: 350,
  },
  {
    _id: 4,
    name: 'Restaurent Name',
    image: 'https://freeaiavatargenerator.pro/wp-content/uploads/2023/03/ai-generated-gebca0d715_1920.jpg',
    createdAt: 'April 20, 2020',
    dueDate: 'April 17, 2020',
    autoGenId: '#4552222',
    seller: {
      company_name: 'Seller Name',
    },
    amount: 148,
  },
];

export const getPayoutData = (data) => {
  console.log('data===>rider', data);
  const template = {
    name: '',
    autoGenId: '',
    image: '',
    route: '',
    type: '',
    totalAmount: 0,
    address: '',
    info: {},
  };

  const shopData = data?.shop;

  const riderData = data?.deliveryBoy;

  if (shopData) {
    template.name = shopData?.shopName;
    template.autoGenId = shopData?.autoGenId;
    template.image = shopData?.shopLogo;
    template.route = `/shop/profile/${shopData?._id}`;
    template.type = 'Shop';
    template.address = shopData?.address?.address;
    template.totalAmount = shopData?.profitBreakdown?.totalAmount;
    template.info = { ...data };
    return template;
  }

  if (riderData) {
    template.name = riderData?.name;
    template.autoGenId = riderData?.autoGenId;
    template.image = riderData?.image;
    template.route = `/riders/${riderData?._id}`;
    template.type = 'Rider';
    template.address = riderData?.address;
    template.totalAmount = riderData?.profitBreakdown?.riderPayout;
    template.info = { ...data };
    return template;
  }

  return template;
};
