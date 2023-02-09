/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';

class lineareachart extends Component {
  render() {
    const lineChartData = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [[5, 9, 7, 8, 5, 3, 5, 4]],
    };
    const lineChartOptions = {
      low: 0,
      showArea: true,
    };
    return <ChartistGraph data={lineChartData} style={{ height: '300px' }} options={lineChartOptions} type="Line" />;
  }
}

export default lineareachart;
