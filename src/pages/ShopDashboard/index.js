// third party
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

// project import
import TabPanel from '../../components/Common/TabPanel';
import Greeting from './Greeting';
import Orders from './Orders';

export default function ShopDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box pt={9}>
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
          <Tab label="Orders" />
          <Tab label="Customers" />
          <Tab label="Operations" />
        </Tabs>
      </Stack>
      <TabPanel index={0} value={currentTab} noPadding>
        <Orders />
      </TabPanel>
    </Box>
  );
}
