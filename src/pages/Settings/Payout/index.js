import { Box } from '@mui/material';
import React from 'react';
import PageTop from '../../../components/Common/PageTop';
import Settings from './Settings';

function PayoutConfiguration() {
  return (
    <Box sx={{ backgroundColor: '#fbfbfb', height: '100%' }}>
      <PageTop title="Payouts Configuration" backButtonLabel="Back to Settings" backTo="/settings" />
      <Settings />
    </Box>
  );
}

export default PayoutConfiguration;
