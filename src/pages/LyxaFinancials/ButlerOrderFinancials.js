/* eslint-disable no-unused-vars */
// third party
import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';

// local
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';

import PageTop from '../../components/Common/PageTop';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import ButlerOrderPayoutDetails from './ButlerOrderPayoutDetails';
import ButlerOrderPayoutDetailsTable from './ButlerOrderPayoutDetailsTable';
import { convertDate } from './OrderFinancials';

const breadcrumbItems = [
  {
    label: 'Lyxa Financials',
    to: '/financials/lyxa',
  },
  {
    label: 'Lyxa Butler Financials',
    to: '#',
  },
];

export default function LyxaButlerOrderFinancials() {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  const getFinancialsDashBoard = useQuery(
    [
      API_URL.GET_ADMIN_BUTLER_FINANCIALS_DASHBOARD,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_ADMIN_BUTLER_FINANCIALS_DASHBOARD, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  // admin/financial/butler

  console.log('getFinancialsDashBoard for butler', getFinancialsDashBoard?.data?.data);

  const summary = getFinancialsDashBoard?.data?.data;

  const profitBreakdown = summary?.profitBreakdown;

  return (
    <Box>
      <PageTop
        // title="Lyxa Butler Financials"
        backTo="/financials"
        backButtonLabel="Back to Lyxa Financials"
        breadcrumbItems={breadcrumbItems}
      />
      <Grid container spacing={7.5} pb={7.5}>
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
            <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
          </Stack>
        </Grid>
        <InfoCard
          title="Total Lyxa Profit"
          value={profitBreakdown?.adminButlerProfit || 0}
          Tag={
            <IncreaseDecreaseTag
              status="increase"
              amount={`${summary?.adminButlerProfitAvgInPercentage || 0}% last ${0}`}
            />
          }
          sm={6}
          md={6}
          lg={6}
        />
        <InfoCard
          title="Total Orders"
          value={summary?.totalDeliveredOrder || 0}
          Tag={
            <IncreaseDecreaseTag
              status="increase"
              amount={`${summary?.totalDeliveredOrderAvgInPercentage || 0}% last ${0}`}
            />
          }
          sm={6}
          md={6}
          lg={6}
        />
        <ButlerOrderPayoutDetails paymentDetails={profitBreakdown} />
        <Grid xs={12}>
          <ButlerOrderPayoutDetailsTable />
        </Grid>
      </Grid>
    </Box>
  );
}
