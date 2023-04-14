import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import ChartBox from '../../../components/StyledCharts/ChartBox';
import DateRange from '../../../components/StyledCharts/DateRange';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import { areaChartData, barChartData2, lineChartData } from '../../Marketing/Dashbaord/mock';
import PayoutDetails from './PayoutDetails';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function Overview() {
  // charts
  const [revenueRange, setRevenueRange] = useState({ ...dateRangeItit });
  const [payoutRange, setPayoutRange] = useState({ ...dateRangeItit });
  const [uRange, setURange] = useState({ ...dateRangeItit });
  const [refundRange, setrefundRange] = useState({ ...dateRangeItit });

  return (
    <Grid container spacing={7.5} pb={3} pt={7.5}>
      <ChartBox chartHeight={300} dateRange={revenueRange} setDateRange={setRevenueRange} title="Total Revenue" sm={12}>
        <StyledAreaChart data={areaChartData} />
      </ChartBox>
      <Grid xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <DateRange setRange={setURange} range={uRange} />
        </Stack>
      </Grid>
      <InfoCard
        title="Total Payout"
        value="$2551"
        Tag={<IncreaseDecreaseTag status="increase" amount="29%" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Total Orders"
        value={14}
        Tag={<IncreaseDecreaseTag status="increase" amount="11%" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Customer Refund"
        value="$12"
        Tag={<IncreaseDecreaseTag status="decrement" amount="9%" />}
        sm={6}
        md={4}
        lg={4}
      />
      <PayoutDetails />
      <ChartBox
        chartHeight={325}
        dateRange={payoutRange}
        setDateRange={setPayoutRange}
        title="Payout details"
        sm={12}
        xl={6}
      >
        <StyledBarChart data={barChartData2} />
      </ChartBox>
      <ChartBox
        chartHeight={325}
        dateRange={refundRange}
        setDateRange={setrefundRange}
        title="Customer refunds"
        sm={12}
        xl={6}
      >
        <StyledAreaChart data={lineChartData} />
      </ChartBox>
    </Grid>
  );
}
