// third party
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

// project import
import TabPanel from '../../components/Common/TabPanel';
import Customers from '../../components/Shared/Customers';
import Operations from '../../components/Shared/Operations';
import Greeting from './Greeting';
import Overview from './Overview';

export default function ShopDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box pt={9} pb={12}>
      <Greeting />
      <Typography variant="h4" pt={14}>
        Dashboard
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10}>
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
          <Tab label="Customers" />
          <Tab label="Operations" />
        </Tabs>
      </Stack>
      <Box pt={7.5}>
        <TabPanel index={0} value={currentTab} noPadding>
          <Overview />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Customers viewUserType="shop" />
        </TabPanel>
        <TabPanel index={2} value={currentTab} noPadding>
          <Operations viewUserType="shop" />
        </TabPanel>
      </Box>
    </Box>
  );
}
