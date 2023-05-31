// local
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import AXIOS from '../../network/axios';
import ChartBox from './ChartBox';
import StyledAreaChart from './StyledAreaChart';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function CommonAreaChart({ title, generateData, api, params }) {
  const [range, setRange] = useState({ ...dateRangeItit });
  console.log(params);

  const query = useQuery(
    [
      api,
      {
        endDate: moment(range.end).format('YYYY-MM-DD'),
        startDate: moment(range.start).format('YYYY-MM-DD'),
        year: undefined,
        type: 'normal',
        ...params,
      },
    ],
    () =>
      AXIOS.get(api, {
        params: {
          endDate: moment(range.end).format('YYYY-MM-DD'),
          startDate: moment(range.start).format('YYYY-MM-DD'),
          year: undefined,
          type: 'normal',
          ...params,
        },
      })
  );

  const data = generateData(query?.data);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: data.data,
        borderColor: 'rgba(126, 130, 153, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(126, 130, 153, 0.15)',
      },
    ],
  };

  return (
    <ChartBox
      loading={query?.isLoading}
      chartHeight={300}
      dateRange={range}
      setDateRange={setRange}
      title={title}
      sm={12}
    >
      <StyledAreaChart data={chartData} />
    </ChartBox>
  );
}
