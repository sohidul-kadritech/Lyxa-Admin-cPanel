import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import TabPanel from '../../components/Common/TabPanel';
import Documents from './Documents';
import RiderFlags from './Flags';
import RiderOrders from './Orders';
import RiderRating from './RiderRating';
import RiderTimeStamp from './Timestamp';
import RiderTransactions from './Transactions';

export default function RiderTabs({ rider }) {
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [currentTab, setCurrentTab] = useState(Number(searchParams?.get('tabId')) || 0);

  return (
    <Box>
      <Tabs
        value={currentTab}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
      >
        <Tab label="Orders" />
        {rider?.deliveryBoyType !== 'shopRider' && <Tab label="Transactions" />}
        {rider?.deliveryBoyType !== 'shopRider' && <Tab label="Cash Orders" />}
        {rider?.deliveryBoyType !== 'shopRider' && <Tab label="Timestamp" />}
        {rider?.deliveryBoyType !== 'shopRider' && <Tab label="Flagged" />}
        <Tab label="Documents" />
        {rider?.deliveryBoyType !== 'shopRider' && <Tab label="Shop Rating" />}
      </Tabs>
      <Box>
        <TabPanel index={0} value={currentTab}>
          <RiderOrders riderId={rider?._id} />
        </TabPanel>
        <TabPanel index={rider?.deliveryBoyType !== 'shopRider' ? 1 : 5} value={currentTab}>
          <RiderTransactions riderId={rider?._id} showFor="transactions" />
        </TabPanel>
        <TabPanel index={2} value={currentTab}>
          <RiderTransactions riderId={rider?._id} showFor="cashOrderList" />
        </TabPanel>
        <TabPanel index={3} value={currentTab}>
          <RiderTimeStamp riderId={rider?._id} />
        </TabPanel>
        <TabPanel index={4} value={currentTab}>
          <RiderFlags flags={rider?.flags} />
        </TabPanel>
        <TabPanel index={rider?.deliveryBoyType !== 'shopRider' ? 5 : 1} value={currentTab}>
          <Documents rider={rider} />
        </TabPanel>
        <TabPanel index={6} value={currentTab}>
          <RiderRating rider={rider} />
        </TabPanel>
      </Box>
    </Box>
  );
}
