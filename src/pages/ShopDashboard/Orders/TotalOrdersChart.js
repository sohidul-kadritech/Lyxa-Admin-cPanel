// local
import moment from 'moment';
import { useState } from 'react';
import ChartBox from '../../../components/StyledCharts/ChartBox';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import { areaChartData } from '../../Marketing/Dashbaord/mock';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function TotalOrders() {
  const [range, setRange] = useState({ ...dateRangeItit });

  return (
    <ChartBox
      //   loading={orderAmountGraphQuery?.isLoading}
      chartHeight={300}
      dateRange={range}
      setDateRange={setRange}
      title="Total Orders"
      sm={12}
    >
      <StyledAreaChart data={areaChartData} />
    </ChartBox>
  );
}
