import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../../components/Common/PageTop';
import TabPanel from '../../../components/Common/TabPanel';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SellerFinancialsTable from './SellerFinancialsTable';

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

  const getSellerTnx = useQuery([API_URL.SELLERS_TRX], () => AXIOS.get(API_URL.SELLERS_TRX));

  console.log('tnx seller: ', getSellerTnx?.data?.data?.sellers);
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
      <Box></Box>
      <Box sx={{ marginBottom: '30px' }}>
        <TabPanel index={0} value={currentTab} noPadding>
          <SellerFinancialsTable loading={getSellerTnx?.isLoading} data={getSellerTnx?.data?.data?.sellers} />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Typography>Invoices</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default FinancialsForSeller;
