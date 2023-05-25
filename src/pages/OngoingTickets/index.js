import { Box, Unstable_Grid2 as Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import { useGlobalContext } from '../../context';
import ChatDetails from './ChatDetail';
import ChatsList from './ChatsList';
import { order } from './mock';

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  const [currentTab, setCurrentTab] = useState(0);
  const chat = { order };

  return (
    <Grid
      container
      sx={{
        height: 'calc(100vh - 83px)',
        overflowY: 'hidden',
      }}
    >
      <Grid
        lg={7}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Box pt={9}>
          <Typography variant="h4" pb={10}>
            Dashboard
          </Typography>
          <UserProfileInfo
            user={{
              name: admin?.name,
              email: admin?.email,
              phone: admin?.phone_number,
            }}
            avatarProps={{
              sx: { width: 70, height: 70 },
            }}
            containerProps={{ sx: { gap: 5 } }}
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
            <Tab label="Orders Ticket" />
            <Tab label="Account Tickets" />
          </Tabs>
          <Box pt={9}>
            <TabPanel index={0} value={currentTab} noPadding>
              <ChatsList />
            </TabPanel>
          </Box>
        </Box>
      </Grid>
      <Grid
        lg={5}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <ChatDetails chat={chat} />
      </Grid>
    </Grid>
  );
}
