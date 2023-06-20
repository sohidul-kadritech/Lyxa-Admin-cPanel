// third party
import { Avatar, Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';

// project import
import { useState } from 'react';
import { useGlobalContext } from '../../../context';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
import Details from './Details';
import Earnings from './Earnings';
import Review from './Reviews';

export default function OrderDetail({ order, onClose, hideIssues }) {
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;

  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

  console.log(order);

  return (
    <Box
      sx={{
        width: '400px',
        padding: '0px 20px 25px 20px',
      }}
    >
      <Box>
        <Box
          sx={{
            position: 'sticky',
            top: '0',
            background: '#fff',
            padding: '25px 0px',
            zIndex: '999',
          }}
        >
          {/* top */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={3}>
              <Avatar alt="user-image" src={order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
                {order?.user?.name?.length && order?.user?.name[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4">{order?.user?.name}</Typography>
                <Typography variant="body4" color="#737373">
                  {order?.user?.orderCompleted || 0} orders
                </Typography>
              </Stack>
            </Stack>
            <CloseButton
              disableRipple
              onClick={onClose}
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          </Stack>
          {/* heading */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10} pb={6}>
            <Typography variant="h5" fontSize={17} lineHeight="21px" fontWeight={700}>
              Order# {order?.orderId}
            </Typography>
            <Typography
              variant="h5"
              fontSize={12}
              lineHeight="20px"
              sx={{
                flexShrink: 0,
              }}
            >
              {moment(order?.createdAt).format('ddd DD, MMM, YYYY')}
            </Typography>
          </Stack>
          <Box sx={{ margin: '0 -8px' }}>
            <Tabs
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              onChange={(event, newValue) => {
                setCurrentTab(newValue);
              }}
              sx={{
                '& .MuiTab-root': {
                  padding: '8px 12px',
                  textTransform: 'none',
                },

                '& .MuiTabScrollButton-root': {
                  width: '15px',
                },
              }}
            >
              <Tab label="Order Details" />
              <Tab label="Review" />
              {userType === 'admin' && <Tab label="Earning Details" />}
              {/* <Tab label="Flag Details" /> */}
              <Tab label="Tickets" />
              <Tab label="Rider Chat" />
            </Tabs>
          </Box>
        </Box>
        {/* order detail */}
        <TabPanel index={0} value={currentTab} noPadding>
          <Details hideIssues={hideIssues} order={order} userType={userType} />
        </TabPanel>
        {/* review */}
        <TabPanel index={1} value={currentTab} noPadding>
          <Review reviews={order?.reviews} />
        </TabPanel>
        {/* earning details */}
        <TabPanel index={2} value={currentTab} noPadding>
          <Earnings order={order} userType={userType} />
        </TabPanel>
        {/* flag details */}
        {/* <TabPanel index={userType === 'admin' ? 3 : 2} value={currentTab} noPadding>
          <FlagDetails order={order} />
        </TabPanel> */}
      </Box>
    </Box>
  );
}
