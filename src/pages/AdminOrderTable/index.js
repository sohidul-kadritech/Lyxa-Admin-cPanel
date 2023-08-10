// third party
import { Box, Tab, Tabs } from '@mui/material';

// project import
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import Flags from './Flags';
import Orders from './Orders';

// also keeping reverse for searchParams
const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'cancelled',
  3: 'flags',
  4: 'low-rating',
  5: 'scheduled',
  ongoing: 0,
  delivered: 1,
  cancelled: 2,
  flags: 3,
  'low-rating': 4,
  scheduled: 5,
};

export default function AdminOrders() {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(orderFilterToTabValueMap[location?.state?.type] || 0);

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
        <Tab label="Flags" />
        <Tab label="Low Rating" />
        <Tab label="Scheduled" />
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
        <TabPanel index={3} value={currentTab} noPadding>
          <Flags />
        </TabPanel>
        <TabPanel index={4} value={currentTab} noPadding>
          <Orders type={orderFilterToTabValueMap[currentTab]} />
        </TabPanel>
        <TabPanel index={5} value={currentTab} noPadding>
          <Orders type={orderFilterToTabValueMap[currentTab]} />
        </TabPanel>
      </Box>
    </Box>
  );
}
