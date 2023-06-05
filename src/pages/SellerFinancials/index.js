import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import Overview from '../../components/Shared/FinancialsOverview';
import Invoices from '../../components/Shared/Invoices';
import { useGlobalContext } from '../../context';
import ShopsTransactions from '../AppWallet/SellerTransactions/ShopsTransactions';

export default function SellerFinancials() {
  const { currentUser } = useGlobalContext();
  const [currentTab, setCurrentTab] = useState(0);

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
        {currentUser?.userType === 'admin' && <Tab label="Invoices" />}
        <Tab label="Shops Transactions" />
      </Tabs>
      <TabPanel
        index={0}
        value={currentTab}
        sx={{
          padding: 0,
        }}
      >
        <Overview viewUserType="seller" />
      </TabPanel>
      {currentUser?.userType === 'admin' && (
        <TabPanel
          index={1}
          value={currentTab}
          sx={{
            paddingTop: 7.5,
          }}
        >
          <Invoices />
        </TabPanel>
      )}
      <TabPanel
        index={currentUser?.userType === 'admin' ? 2 : 1}
        value={currentTab}
        sx={{
          paddingTop: 7.5,
        }}
      >
        <ShopsTransactions />
      </TabPanel>
    </Box>
  );
}