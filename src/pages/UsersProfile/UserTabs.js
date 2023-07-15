import { Box, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import TabPanel from '../../components/Common/TabPanel';
import FlaggedOrders from '../../components/Shared/FlaggedOrders';
import UserOrders from './Orders';
import UserRatings from './Rating';
import UserTransactions from './Transactions';
import UserChatList from './UserChats';

export default function UserTabs({ user }) {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [currentTab, setCurrentTab] = useState(
    searchParams.get('financials') === 'user' ? 4 : Number(searchParams?.get('tabId')) || 0
  );

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
        <Tab label="Tickets" />
        <Tab label="Reviews" />
        <Tab label="Flags" />
        <Tab label="Transactions" />
      </Tabs>
      <Box>
        <TabPanel value={currentTab} index={0}>
          <UserOrders userId={user?._id} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <UserChatList userId={user?._id} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <UserRatings user={user} />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <FlaggedOrders flags={user?.flags} />
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <UserTransactions user={user} />
        </TabPanel>
      </Box>
    </Box>
  );
}
