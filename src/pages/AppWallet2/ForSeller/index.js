import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../../components/Common/PageTop';
import TabPanel from '../../../components/Common/TabPanel';
import SellerInvoice from './Invoices';
import SellerFinancialList from './SellerFinancialList';

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

function FinancialsForSeller() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <PageTop backButtonLabel="Back to Financials" breadcrumbItems={breadcrumbItems} backTo="/financials" />
      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Seller List"></Tab>
          <Tab label="Invoices"></Tab>
        </Tabs>
      </Box>
      <Box sx={{ marginBottom: '35px' }}>
        {/* seller list */}
        <TabPanel index={0} value={currentTab} noPadding>
          <SellerFinancialList />
        </TabPanel>
        {/* Seller invocie */}
        <TabPanel index={1} value={currentTab} noPadding>
          <SellerInvoice />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default FinancialsForSeller;
