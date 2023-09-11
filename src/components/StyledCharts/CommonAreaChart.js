// local
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import AXIOS from '../../network/axios';
import { getFirstMonday } from '../Styled/StyledDateRangePicker/Presets';
import ChartBox from './ChartBox';
import StyledAreaChart from './StyledAreaChart';

const dateRangeItit = {
  end: moment(),
  start: getFirstMonday('week'),
};

export default function CommonAreaChart({ title, generateData, api, params, sx, gridProps, valueLabel = 'Orders' }) {
  const [range, setRange] = useState({ ...dateRangeItit });

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
        // eslint-disable-next-line prettier/prettier
      })
  );

  const data = generateData(query?.data);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        fill: true,
        label: valueLabel,
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
      sx={{
        overflow: 'visible',
        ...sx,
      }}
      sm={12}
      {...gridProps}
    >
      <StyledAreaChart data={chartData} />
    </ChartBox>
  );
}
