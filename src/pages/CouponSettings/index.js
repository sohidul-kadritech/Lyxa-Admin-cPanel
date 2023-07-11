import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import CouponList from './List';
import CouponOverview from './Overview';
import { breadcrumbItems } from './helpers';

export default function CouponSettings() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <PageTop backButtonLabel="Back to Marketing" backTo="/settings/marketing" breadcrumbItems={breadcrumbItems} />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Coupons" />
      </Tabs>
      <Box>
        <TabPanel value={currentTab} index={0} noPadding>
          <CouponOverview />
        </TabPanel>
        <TabPanel value={currentTab} index={1} noPadding>
          <CouponList />
        </TabPanel>
      </Box>
    </Box>
  );
}
