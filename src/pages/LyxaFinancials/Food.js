// third party
import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';

// local
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';

import PayoutDetails from '../../components/Shared/FinancialsOverview/PayoutDetails';
import PayoutDetailsTable from '../../components/Shared/FinancialsOverview/PayoutDetailsTable';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';

export default function RestaurantProfitOverview() {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value="0"
        Tag={<IncreaseDecreaseTag status="increase" amount="0" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value={`${currency} ${0}`}
        Tag={<IncreaseDecreaseTag status="increase" amount="0" />}
        sm={6}
        md={4}
        lg={4}
      />
      <PayoutDetails paymentDetails={{}} />
      <Grid xs={12}>
        <PayoutDetailsTable startDate={paymentDetailsRange.start} endDate={paymentDetailsRange.end} />
      </Grid>
    </Grid>
  );
}
