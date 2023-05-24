import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import Customers from '../../components/Shared/Customers';
import { useGlobalContext } from '../../context';
import Operations from '../ShopDashboard/Operations';
import Orders from './Order';
// import SellerInfo from './SellerInfo';
import UserProfileInfo from '../../components/Common/UserProfileInfo';

export default function SellerDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const { currentUser } = useGlobalContext();
  const { seller } = currentUser;

  return (
    <Box>
      <Typography variant="h4" pt={9} pb={9}>
        Dashboard
      </Typography>
      <UserProfileInfo
        user={{
          name: seller?.name,
          phone: seller?.phone_number,
          email: seller?.email,
          profile: seller?.profile_photo,
          address: seller?.addressSeller?.address,
        }}
      />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          paddingTop: '40px',

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
      <Box pt={7.5}>
        <TabPanel index={0} value={currentTab} noPadding>
          <Orders viewUserType="seller" />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Customers viewUserType="seller" />
        </TabPanel>
        <TabPanel index={2} value={currentTab} noPadding>
          <Operations viewUserType="seller" />
        </TabPanel>
      </Box>
    </Box>
  );
}
