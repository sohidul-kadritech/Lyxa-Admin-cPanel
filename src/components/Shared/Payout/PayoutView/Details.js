/* eslint-disable prettier/prettier */
import { Stack, Typography } from '@mui/material';
import moment from 'moment';

export function Details({ currentPayout }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" mt={10}>
      <Stack maxWidth="450px">
        <Typography variant="h6"> Bill to</Typography>
        <Stack mt={1}>
          <Typography variant="body">
            {currentPayout?.type} name: {currentPayout?.name}
          </Typography>
          <Typography variant="body">Address: {currentPayout?.address}</Typography>
        </Stack>
      </Stack>
      <Stack maxWidth="450px">
        <Typography variant="h6" textAlign="right">
          Details
        </Typography>
        <Stack mt={1}>
          <Typography variant="body" textAlign="right">
            Payout Number: {currentPayout?.autoGenId}
          </Typography>
          <Typography variant="body" textAlign="right">
            Payout Issue Date: {moment(currentPayout?.info?.createdAt).format('DD/MM/YYYY')}
          </Typography>
          <Typography variant="body" textAlign="right">
            Billing Period:{' '}
            {`${moment(currentPayout?.info?.payoutBillingPeriod?.From).format('DD/MM/YYYY')} - ${moment(
              currentPayout?.payoutBillingPeriod?.To,
            ).format('DD/MM/YYYY')}`}
          </Typography>
          <Typography variant="body" textAlign="right">
            Due Date: {`${moment(currentPayout?.info?.payoutOverDueDate).format('DD/MM/YYYY')}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
