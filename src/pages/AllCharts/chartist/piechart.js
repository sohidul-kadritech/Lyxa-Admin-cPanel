import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';

class piechart extends Component {
  render() {
    const pieChartData = {
      series: [5, 3, 4],
      labels: ['42%', '25%', '33%'],
    };
    const pieChartOptions = {
      showLabel: true,
    };
    return <ChartistGraph data={pieChartData} options={pieChartOptions} style={{ height: '300px' }} type="Pie" />;
  }
}

export default piechart;
