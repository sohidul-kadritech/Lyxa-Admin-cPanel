import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import Configuration from './Configuration';
import ReferFriendList from './ReferFriendList';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'Refer a Friend',
    to: '#',
  },
];

function ReferFriend() {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
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
            // setIsSideBarOpen(false);
          }}
        >
          <Tab label="List"></Tab>
          <Tab label="Configuration"></Tab>
        </Tabs>

        <TabPanel index={0} value={currentTab}>
          <ReferFriendList />
        </TabPanel>
        <TabPanel index={1} value={currentTab}>
          <Configuration />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default ReferFriend;
