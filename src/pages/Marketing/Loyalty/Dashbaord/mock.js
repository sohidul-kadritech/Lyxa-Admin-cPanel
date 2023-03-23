export const ProductsInfoListData = [
  {
    name: 'Vegan Burger',
    points: '10',
    sold: '10',
  },
  {
    name: 'Chicken Burger',
    points: '10',
    sold: '10',
  },
  {
    name: 'Meat Burger',
    points: '10',
    sold: '10',
  },
  {
    name: 'Chicken Shawarma',
    points: '10',
    sold: '10',
  },
  {
    name: 'Cheese Sandwich',
    points: '10',
    sold: '10',
  },
  {
    name: 'Tawouk Special',
    points: '10',
    sold: '10',
  },
];

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const barChartData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map((item, index) => index),
      backgroundColor: '#15BFCA',
    },
  ],
};

export const areaChartData = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: labels.map(() => Math.round(Math.random() * 200)),
      borderColor: 'rgba(21, 191, 202, 1)',
      backgroundColor: 'rgba(21, 191, 202, .3)',
    },
  ],
};
