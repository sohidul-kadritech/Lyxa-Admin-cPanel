// third party
import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';

// local
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';

import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import OrderPayoutDetails from './OrderPayoutDetails';
import OrderPayoutDetailsTable from './OrderPayoutDetailsTable';

export default function LyxaOrderFinancials() {
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
        title="Total Orders"
        value="0"
        Tag={<IncreaseDecreaseTag status="increase" amount="0" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Lyxa Marketing Spent"
        isDropdown
        value={`${currency} ${(0).toFixed(2)}`}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      >
        <Stack gap={3}>
          <PriceItem title="Discount" amount={0} showIfZero />
          <PriceItem title="Buy 1 Get 1" amount={0} showIfZero />
          <PriceItem title="Loyalty points" amount={0} showIfZero />
          <PriceItem title="Free delivery" amount={0} showIfZero />
        </Stack>
      </InfoCard>
      <OrderPayoutDetails />
      <Grid xs={12}>
        <OrderPayoutDetailsTable />
      </Grid>
    </Grid>
  );
}
