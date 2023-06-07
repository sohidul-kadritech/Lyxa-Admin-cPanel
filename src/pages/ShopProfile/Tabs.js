import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import FlagTable from './FlagTable';

export default function ShopProfileTabs({ shop }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box sx={{ marginTop: '53px' }}>
      <Box sx={{ paddingBottom: '40px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Flagged" />
          <Tab label="Reviews" />
        </Tabs>
        <TabPanel
          index={0}
          value={currentTab}
          sx={{
            padding: 0,
          }}
        >
          <FlagTable filteredData={shop?.flags || []} currentTab={currentTab} />
        </TabPanel>
        <TabPanel
          index={1}
          value={currentTab}
          sx={{
            padding: 0,
          }}
        >
          <FlagTable filteredData={shop?.reviews || []} currentTab={currentTab} />
        </TabPanel>
      </Box>
    </Box>
  );
}
