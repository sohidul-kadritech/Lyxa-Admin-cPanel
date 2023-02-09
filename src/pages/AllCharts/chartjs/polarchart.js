import React, { Component } from 'react';
import { Polar } from 'react-chartjs-2';

class PolarChart extends Component {
  render() {
    const data = {
      datasets: [
        {
          data: [11, 16, 7, 18],
          backgroundColor: ['#38a4f8', '#02a499', '#ec4561', '#3c4ccf'],
          label: 'My dataset', // for legend
          hoverBorderColor: '#fff',
        },
      ],
      labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4'],
    };

    const option = {
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const meta = dataset._meta[Object.keys(dataset._meta)[0]];
            const { total } = meta;
            const currentValue = dataset.data[tooltipItem.index];
            const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
            return `${currentValue} (${percentage}%)`;
          },
          title(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          },
        },
      },
    };

    return <Polar width={600} height={245} data={data} options={option} />;
  }
}

export default PolarChart;
