import ReactEcharts from 'echarts-for-react';
import React, { Component } from 'react';

class Line extends Component {
  // eslint-disable-next-line class-methods-use-this
  getOption = () => ({
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show: false,
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      zlevel: 0,
      x: 50,
      x2: 50,
      y: 30,
      y2: 30,
      borderWidth: 0,
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(0,0,0,0)',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: '#74788d',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#74788d',
        },
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
    color: ['#3c4ccf'],
  });

  render() {
    return <ReactEcharts style={{ height: '350px' }} option={this.getOption()} />;
  }
}
export default Line;
