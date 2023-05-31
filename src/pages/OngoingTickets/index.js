import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import { useGlobalContext } from '../../context';
import ChatsList from './ChatsList';
import SlideInContainer from './SlideInContainer';
import { order } from './mock';

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  const [currentTab, setCurrentTab] = useState(0);
  const chat = { order };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 83px)',
        overflowY: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <SlideInContainer open={sidebarOpen} type="static" pt={9}>
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
              <ChatsList onOpen={setSidebarOpen} />
            </TabPanel>
            <TabPanel index={1} value={currentTab} noPadding>
              <ChatsList onOpen={setSidebarOpen} />
            </TabPanel>
          </Box>
        </SlideInContainer>
      </Box>
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails showingFor="ongoing" chat={chat} onClose={() => setSidebarOpen(false)} />
      </SlideInContainer>
    </Box>
  );
}
