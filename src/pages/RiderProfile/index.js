/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import RiderFlags from './Flags';
import RiderOrders from './Orders';
import RiderDetails from './RiderDetails';
import RiderTimeStamp from './Timestamp';
import TopInfo from './TopInfo';
import RiderTransactions from './Transactions';

export default function RiderProfile() {
  const location = useLocation();
  const [rider, setRider] = useState(location?.state?.rider);
  const params = useParams();

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <PageTop title="Rider Profile" backButtonLabel="Back to Riders" backTo="/riders" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
        }}
      >
        <Box
          sx={{
            paddingRight: '50px',
            paddingBottom: '30px',
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" pb={12}>
            <TopInfo />
            <Button
              disableRipple
              variant="text"
              color="primary"
              sx={{
                textDecoration: 'underline',
                marginTop: '4px',
              }}
            >
              Edit Account
            </Button>
          </Stack>
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
            <Tab label="Transactions" />
            <Tab label="Cash Orders" />
            <Tab label="Timestamp" />
            <Tab label="Flags" />
            <Tab label="Documents" />
          </Tabs>
          <Box>
            <TabPanel index={0} value={currentTab}>
              <RiderOrders riderId={rider?._id} />
            </TabPanel>
            <TabPanel index={1} value={currentTab}>
              <RiderTransactions />
            </TabPanel>
            <TabPanel index={2} value={currentTab}>
              <RiderTransactions />
            </TabPanel>
            <TabPanel index={3} value={currentTab}>
              <RiderTimeStamp />
            </TabPanel>
            <TabPanel index={4} value={currentTab}>
              <RiderFlags />
            </TabPanel>
          </Box>
        </Box>
        {/* right */}
        <Box
          sx={{
            paddingLeft: '50px',
            borderLeft: '1px solid',
            borderColor: 'custom.border',
          }}
        >
          <RiderDetails rider={rider} />
        </Box>
      </Box>
    </Box>
  );
}
