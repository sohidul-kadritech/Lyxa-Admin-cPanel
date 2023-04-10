const product = [
  {
    name: 'Test',
    image: '',
    line1: 'Cheese, Special Sauce',
    line2: '20% discount . Buy 1, get 1 free . 25% points enabled',
  },
];

const category = {
  _id: 'name',
  name: 'Pizza',
  products: [product, product],
};

export const categories = [category];
