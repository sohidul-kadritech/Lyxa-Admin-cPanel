import ReactEcharts from 'echarts-for-react';
import cloneDeep from 'lodash.clonedeep';
import React, { Component } from 'react';

class Guage extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  // eslint-disable-next-line class-methods-use-this, react/sort-comp
  getOption = () => ({
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    series: [
      {
        name: 'Business indicator',
        type: 'gauge',
        detail: { formatter: '{value}%' },
        axisLine: {
          lineStyle: {
            color: [
              [0.2, '#02a499'],
              [0.8, '#3c4ccf'],
              [1, '#ec4561'],
            ],
            width: 20,
          },
        },
        data: [{ value: 50, name: 'Completion rate' }],
      },
    ],
  });

  // eslint-disable-next-line react/sort-comp
  timeTicket = null;

  getInitialState() {
    return { option: this.getOption() };
  }

  componentDidMount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
    this.timeTicket = setInterval(() => {
      // eslint-disable-next-line react/destructuring-assignment, react/no-access-state-in-setstate
      const option = cloneDeep(this.state.option);
      option.series[0].data.value = (Math.random() * 100).toFixed(2) - 0;
      this.setState({ option });
    }, 2000);
  }

  componentWillUnmount() {
    if (this.timeTicket) {
      clearInterval(this.timeTicket);
    }
  }

  render() {
    return <ReactEcharts style={{ height: '350px' }} option={this.getOption()} />;
  }
}
export default Guage;
