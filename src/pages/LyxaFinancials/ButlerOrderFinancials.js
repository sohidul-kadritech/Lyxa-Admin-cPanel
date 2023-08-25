// third party
import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';

// local
import DateRange from '../../components/StyledCharts/DateRange';

import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import ButlerOrderPayoutDetails from './ButlerOrderPayoutDetails';
import ButlerOrderPayoutDetailsTable from './ButlerOrderPayoutDetailsTable';

export default function LyxaButlerOrderFinancials() {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  return (
    <Grid container spacing={7.5} pb={7.5} pt={7.5}>
      <Grid xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
          <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
        </Stack>
      </Grid>
      <InfoCard
        title="Total Lyxa Profit"
        value={0}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={6}
        lg={6}
      />
      <InfoCard
        title="Total Orders"
        value="0"
        Tag={<IncreaseDecreaseTag status="increase" amount="0" />}
        sm={6}
        md={6}
        lg={6}
      />
      <ButlerOrderPayoutDetails />
      <Grid xs={12}>
        <ButlerOrderPayoutDetailsTable />
      </Grid>
    </Grid>
  );
}
