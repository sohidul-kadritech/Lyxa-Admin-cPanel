/* eslint-disable no-unused-vars */
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRider from '../Riders/AddRider';
import Documents from './Documents';
import RiderFlags from './Flags';
import RiderOrders from './Orders';
import RiderDetails from './RiderDetails';
import RiderRating from './RiderRating';
import RiderTimeStamp from './Timestamp';
import TopInfo from './TopInfo';
import RiderTransactions from './Transactions';

export default function RiderProfile() {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const [rider, setRider] = useState(location?.state?.rider);
  console.log(params);

  const query = useQuery(
    [Api.SINGLE_DELIVERY_MAN, { id: params?.riderId }],
    () =>
      AXIOS.get(Api.SINGLE_DELIVERY_MAN, {
        params: {
          id: params?.riderId,
        },
      }),
    {
      enabled: params?.riderId !== location?.state?.rider?._id,
      onSuccess: (data) => {
        if (data?.status) {
          setRider(data?.data?.delivery);
        }
      },
    }
  );
  const [currentTab, setCurrentTab] = useState(Number(searchParams?.get('tabId')) || 0);

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
            <TopInfo rider={rider} />
            <Button
              disableRipple
              variant="text"
              color="primary"
              onClick={() => {
                setOpen(true);
              }}
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
            <Tab label="Flagged" />
            <Tab label="Documents" />
            <Tab label="Shop Rating" />
          </Tabs>
          <Box>
            <TabPanel index={0} value={currentTab}>
              <RiderOrders riderId={rider?._id} />
            </TabPanel>
            <TabPanel index={1} value={currentTab}>
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
            <TabPanel index={5} value={currentTab}>
              <Documents rider={rider} />
            </TabPanel>
            <TabPanel index={6} value={currentTab}>
              <RiderRating rider={rider} />
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
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <AddRider
          hideDelete
          editRider={rider}
          onClose={() => setOpen(false)}
          onUpdateSuccess={(data) => {
            setRider(data?.data?.delivery);
          }}
        />
      </Drawer>
    </Box>
  );
}
