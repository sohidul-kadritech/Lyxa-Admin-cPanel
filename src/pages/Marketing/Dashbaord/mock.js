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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

export const barChartData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.round(Math.random() * 200)),
      backgroundColor: '#15BFCA',
    },
  ],
};

export const barChartData2 = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.round(Math.random() * 200)),
      backgroundColor: 'rgba(60, 172, 221, 1)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => Math.round(Math.random() * 200)),
      backgroundColor: 'rgba(221, 60, 105, 1)',
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
      borderColor: 'rgba(126, 130, 153, 1)',
      borderWidth: 1,
      backgroundColor: 'rgba(126, 130, 153, 0.15)',
    },
  ],
};

export const lineChartData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [undefined, 32, 70, 29, 82, undefined],
      borderColor: 'rgba(21, 191, 202, 1)',
      backgroundColor: 'rgba(21, 191, 202, 0)',
      borderWidth: 1,
    },
  ],
};
