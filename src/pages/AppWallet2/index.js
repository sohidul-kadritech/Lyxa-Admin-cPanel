import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';

import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import FinancialsForSeller from './ForSeller';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'For Sellers',
    to: '#',
  },
];

function AppFinancials() {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Financials"
        breadcrumbItems={breadcrumbItems}
        backTo="/financials"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Seller LIst"></Tab>
          <Tab label="Invoices"></Tab>
        </Tabs>
      </Box>
      <Box sx={{ marginBottom: '30px' }}>
        <TabPanel index={0} value={currentTab} noPadding>
          <FinancialsForSeller />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Typography>Invoices</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default AppFinancials;
