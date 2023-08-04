import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import MarketingHistory from './History';
import MarketingOverview from './Overview';

export default function Marketing({ viewUserType }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box sx={{ pt: 8.5, pb: 8.5 }}>
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
      >
        <Tab label="Overview" />
        <Tab label="History" />
      </Tabs>
      <Box pt="30px">
        <TabPanel index={0} value={currentTab} noPadding>
          <MarketingOverview viewUserType={viewUserType} />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <MarketingHistory viewUserType={viewUserType} />
        </TabPanel>
      </Box>
    </Box>
  );
}
