import { Box } from '@mui/material';
import React from 'react';
import PageTop from '../../components/Common/PageTop';
import PayoutList from '../../components/Shared/Payout';

const breadcrumbItems = [
  {
    label: 'Lyxa Financials',
    to: '/financials/lyxa',
  },
  {
    label: 'Lyxa Payouts',
    to: '#',
  },
];

function LyxaPayout() {
  return (
    <Box>
      <PageTop backTo="/financials/lyxa" backButtonLabel="Back to Lyxa Financials" breadcrumbItems={breadcrumbItems} />
      <PayoutList payaoutParams={{ payoutAccount: '' }} showFor="admin" />
    </Box>
  );
}

export default LyxaPayout;
