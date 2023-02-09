import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class BarChart extends Component {
  render() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales Analytics',
          backgroundColor: '#02a499',
          borderColor: '#02a499',
          borderWidth: 1,
          hoverBackgroundColor: '#02a499',
          hoverBorderColor: '#02a499',
          data: [65, 59, 81, 45, 56, 80, 50, 20],
        },
      ],
    };

    const option = {
      tootlbar: {
        show: false,
      },
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

    return <Bar width={600} height={245} data={data} options={option} />;
  }
}

export default BarChart;
