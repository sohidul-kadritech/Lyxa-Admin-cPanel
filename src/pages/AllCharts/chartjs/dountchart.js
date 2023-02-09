import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

class DountChart extends Component {
  render() {
    const data = {
      labels: ['Desktops', 'Tablets'],
      datasets: [
        {
          data: [300, 210],
          backgroundColor: ['#3c4ccf', '#ebeff2'],
          hoverBackgroundColor: ['#3c4ccf', '#ebeff2'],
          hoverBorderColor: '#fff',
        },
      ],
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
    return <Doughnut width={600} height={215} data={data} options={option} />;
  }
}

export default DountChart;
