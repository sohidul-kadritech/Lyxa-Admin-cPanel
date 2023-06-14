// third party
import { Box, Tab, Tabs } from '@mui/material';

// project import
import { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import Orders from './Orders';

const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'cancelled',
};

export default function AdminOrders() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box pb={9}>
      <PageTop title="Orders" />
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
        <Tab label="Ongoing" />
        <Tab label="Delivered" />
        <Tab label="Incomplete" />
      </Tabs>
      <Box>
        <TabPanel index={0} value={currentTab} noPadding>
          <Orders type={orderFilterToTabValueMap[currentTab]} />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Orders type={orderFilterToTabValueMap[currentTab]} />
        </TabPanel>
        <TabPanel index={2} value={currentTab} noPadding>
          <Orders type={orderFilterToTabValueMap[currentTab]} />
        </TabPanel>
      </Box>
    </Box>
  );
}
