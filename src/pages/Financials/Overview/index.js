/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
// third party
import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// local
import ChartBox from '../../../components/StyledCharts/ChartBox';
import DateRange from '../../../components/StyledCharts/DateRange';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { areaChartData, barChartData2, lineChartData } from '../../Marketing/Dashbaord/mock';
import PayoutDetails from './PayoutDetails';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function Overview() {
  const shop = useSelector((store) => store.Login.admin);

  const [revenueRange, setRevenueRange] = useState({ ...dateRangeItit });
  const [payoutRange, setPayoutRange] = useState({ ...dateRangeItit });
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const [refundRange, setrefundRange] = useState({ ...dateRangeItit });

  const shopDashboardQuery = useQuery(
    ['shop-dashboard', { startDate: paymentDetailsRange.start, endDate: paymentDetailsRange.end }],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_SUMMARY, {
        params: { startDate: paymentDetailsRange.start, endDate: paymentDetailsRange.end },
      })
  );

  const shopTransactionsQuery = useQuery(
    [`single-shop-transations`, { startDate: paymentDetailsRange.start, endDate: paymentDetailsRange.end }],
    () =>
      AXIOS.post(Api.SHOP_TRX, {
        page: 1,
        pageSize: 500,
        pagingRange: 5,
        tnxFilter: {
          adminBy: '',
          type: ['adminAddBalanceShop', 'adminRemoveBalanceShop', 'adminSettlebalanceShop'],
          searchKey: '',
          amountBy: 'asc',
          amountRange: 0,
          amountRangeType: '>',
          startDate: paymentDetailsRange.start,
          endDate: paymentDetailsRange.end,
        },
        shopId: shop?._id,
        sortBy: 'desc',
      }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <Grid container spacing={7.5} pb={3} pt={7.5}>
      <ChartBox chartHeight={300} dateRange={revenueRange} setDateRange={setRevenueRange} title="Total Revenue" sm={12}>
        <StyledAreaChart data={areaChartData} />
      </ChartBox>
      <Grid xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
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
        value={`${
          shopDashboardQuery?.data?.data?.summary?.totalCancelOrder +
          shopDashboardQuery?.data?.data?.summary?.totalDeliverOrder
        }`}
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
      <PayoutDetails
        paymentDetails={shopDashboardQuery?.data?.data?.summary}
        transactionDetails={shopTransactionsQuery?.data?.data?.summary}
      />
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
