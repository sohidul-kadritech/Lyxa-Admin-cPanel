// SINGLE_DELIVERY_TRX
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import InfoCard from '../../../components/StyledCharts/InfoCard';
// import Transactions from '../../../components/Shared/ChatDetail/UserProfile/Transactions';
import TransactionsTable from './Table';
import { getMockTrx } from './mock';

export default function RiderTransactions() {
  return (
    <Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard title="Lyxa Earning" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Unsettled Amount" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Rider Earning" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Cash in Hand" value="2551" sm={6} md={4} lg={3} />
      </Grid>
      <TransactionsTable rows={getMockTrx(5)} />
    </Box>
  );
}
