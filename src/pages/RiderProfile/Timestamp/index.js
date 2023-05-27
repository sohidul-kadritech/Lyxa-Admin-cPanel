// SINGLE_DELIVERY_TRX
import { Box, Unstable_Grid2 as Grid, Stack, Tooltip, Typography } from '@mui/material';
import InfoCard from '../../../components/StyledCharts/InfoCard';
// import Transactions from '../../../components/Shared/ChatDetail/UserProfile/Transactions';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import TransactionsTable from '../Transactions/Table';
import { getMockTrx } from '../Transactions/mock';
// import TransactionsTable from './Table';
// import { getMockTrx } from './mock';

function CardTitle({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Tooltip arrow title={tooltip}>
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}

export default function RiderTimeStamp() {
  return (
    <Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard
          title={<CardTitle title="Active Time" tooltip="How much time was the rider active during business hours?" />}
          value="25 min"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={<CardTitle title="Downtime" tooltip="How much time was your rider unavailable during menu hours?" />}
          value="25 min"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={
            <CardTitle title="Rider Rejecterd" tooltip="How many orders were rejected by rider during working hours?" />
          }
          value="2551"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={
            <CardTitle title="Missed Orders" tooltip="How many orders were missed by rider during working hours?" />
          }
          value="2551"
          sm={6}
          md={4}
          lg={3}
        />
      </Grid>
      <TransactionsTable rows={getMockTrx(5)} />
    </Box>
  );
}
