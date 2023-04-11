const product = {
  name: 'Test',
  image: '',
  line1: 'Cheese, Special Sauce',
  line2: '20% discount . Buy 1, get 1 free . 25% points enabled',
  price: '80',
};

const product2 = {
  name: 'Test2',
  image: '',
  line1: 'Cheese, Special Sauce',
  line2: '20% discount . Buy 1, get 1 free . 25% points enabled',
  price: '80',
};

const category = {
  _id: 'name',
  name: 'Pizza',
  products: [product, product2],
};

export const categories = [category, category, category, category];
