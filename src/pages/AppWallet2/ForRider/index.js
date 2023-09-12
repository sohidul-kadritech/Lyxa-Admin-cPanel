import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../../components/Common/PageTop';
import TabPanel from '../../../components/Common/TabPanel';
import PayoutList from '../../../components/Shared/Payout';
import RiderList from './RiderList';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'For Riders',
    to: '#',
  },
];

function RidersTransaction() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Financials"
        breadcrumbItems={breadcrumbItems}
        backTo="/financials"
        sx={{
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box sx={{ marginBottom: '35px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Rider LIst"></Tab>
          <Tab label="Payouts"></Tab>
        </Tabs>
      </Box>
      <Box sx={{ marginBottom: '35px' }}>
        <TabPanel index={0} value={currentTab} noPadding>
          <RiderList />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <PayoutList showFor="rider" payaoutParams={{ payoutAccount: 'deliveryBoy' }} />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default RidersTransaction;
