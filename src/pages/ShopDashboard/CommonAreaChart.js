// local
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../components/StyledCharts/ChartBox';
import StyledAreaChart from '../../components/StyledCharts/StyledAreaChart';
import AXIOS from '../../network/axios';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function CommonAreaChart({ title, generateData, api, cacheKey }) {
  const [range, setRange] = useState({ ...dateRangeItit });

  const query = useQuery(
    [
      cacheKey,
      {
        endDate: range.end,
        startDate: range.start,
        year: undefined,
        type: 'normal',
      },
    ],
    () =>
      AXIOS.get(api, {
        params: {
          endDate: range.end,
          startDate: range.start,
          year: undefined,
          type: 'normal',
        },
        // eslint-disable-next-line prettier/prettier
      }),
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
