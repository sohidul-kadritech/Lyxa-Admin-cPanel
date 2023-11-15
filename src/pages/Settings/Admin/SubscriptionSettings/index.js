import { Box, Stack } from '@mui/material';
import React from 'react';
import PageTop from '../../../../components/Common/PageTop';
import Settings from './Settings';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Subscription Settings',
    to: '#',
  },
];

function SubscriptionSettings() {
  return (
    <Box>
      <PageTop breadcrumbItems={breadcrumbItems} />
      <Stack>
        <Settings />
      </Stack>
    </Box>
  );
}

export default SubscriptionSettings;
