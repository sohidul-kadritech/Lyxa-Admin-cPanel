import { Box, Tab, Tabs, Typography, styled } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import { useGlobalContext } from '../../context';
import ChatDetails from './ChatDetail';
import ChatsList from './ChatsList';
import { order } from './mock';

const StyledDetailContainer = styled(Box)(() => ({
  height: 'calc(100% - 18px)',
  overflowY: 'auto',
  position: 'absolute',
  paddingBottom: '20px',
  top: 0,
  background: '#fff',
  right: '0',
  width: 'calc(calc(100vw / 10) * 4)',
  zIndex: '99',
  transform: 'translateX(100%)',
  transition: '200ms ease-in-out',
  opacity: 0,

  '&.sidebar-open': {
    transform: 'translateX(0)',
    opacity: 1,
  },
}));

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
        <Box
          className={sidebarOpen ? 'sidebar-open' : ''}
          pt={9}
          sx={{
            '&.sidebar-open': {
              paddingRight: 'calc(calc(100vw / 10) * 4)',
              transition: '200ms ease-in-out',
            },
          }}
        >
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
          </Box>
        </Box>
      </Box>
      <StyledDetailContainer className={sidebarOpen ? 'sidebar-open' : ''}>
        <ChatDetails chat={chat} onClose={() => setSidebarOpen(false)} />
      </StyledDetailContainer>
    </Box>
  );
}
