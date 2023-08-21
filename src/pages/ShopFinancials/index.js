import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import Overview from '../../components/Shared/FinancialsOverview';
import Invoices from '../../components/Shared/Invoices';
import { useGlobalContext } from '../../context';
import Banking from './Banking';

export default function ShopFinancials() {
  const [currentTab, setCurrentTab] = useState(0);
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  console.log('shopReceivePaymentBy', shop?.shopReceivePaymentBy);

  return (
    <Box pb={10}>
      <PageTop title="Financials" />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
      >
        <Tab label="Overview" />
        <Tab label="Payouts" />
        {shop?.shopReceivePaymentBy === 'bank' && <Tab label="Banking" />}
      </Tabs>

      <TabPanel
        index={0}
        value={currentTab}
        sx={{
          padding: 0,
        }}
      >
        <Overview viewUserType="shop" />
      </TabPanel>

      <TabPanel
        index={1}
        value={currentTab}
        sx={{
          paddingTop: 7.5,
        }}
      >
        <Invoices />
      </TabPanel>

      {shop?.shopReceivePaymentBy === 'bank' && (
        <TabPanel
          index={2}
          value={currentTab}
          sx={{
            paddingTop: 7.5,
          }}
        >
          <Banking />
        </TabPanel>
      )}
    </Box>
  );
}
