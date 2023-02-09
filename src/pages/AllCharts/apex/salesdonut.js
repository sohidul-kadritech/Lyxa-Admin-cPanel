import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Salesdonut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: '80%',
            },
          },
        },
        colors: ['#626ed4', '#02a499', '#f8b425'],
      },
      series: [54, 28, 17],
      // eslint-disable-next-line react/no-unused-state
      labels: [1, 2, 3],
    };
  }

  render() {
    const { options, series } = this.state;
    return <ReactApexChart options={options} series={series} type="donut" height="220" />;
  }
}

export default Salesdonut;
