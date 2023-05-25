import { Avatar, Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
// import OrderDetail from '../../../components/Shared/OrderDetail';
import Chat from './Chat';
import ChatOrderDetail from './Detail';
import UserProfile from './UserProfile';

export default function ChatDetails({ chat, onClose }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Stack
      sx={{
        background: '#fff',
        paddingTop: 6,
        height: '100%',
        px: 5,
        paddingBottom: '20px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={10}>
        <Stack direction="row" alignItems="center" gap={3}>
          <Avatar alt="user-image" src={chat?.order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
            {chat?.order?.user?.name?.length && chat?.order?.user?.name[0]}
          </Avatar>
          <Stack gap={0.5}>
            <Typography variant="body4">{chat?.order?.user?.name}</Typography>
            <Typography variant="body4" color="#737373">
              9 orders
            </Typography>
          </Stack>
        </Stack>
        <CloseButton
          disableRipple
          onClick={onClose}
          sx={{
            color: 'text.primary',
          }}
        />
      </Stack>
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
            flex: '1',
          },
        }}
      >
        <Tab label="Chat" />
        <Tab label="Order Details" />
        <Tab label="Profile" />
      </Tabs>
      <Box pt={7.5} flex={1}>
        <TabPanel index={0} value={currentTab} sx={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}>
          <Chat order={chat?.order} />
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <ChatOrderDetail order={chat?.order} />
        </TabPanel>
        <TabPanel index={2} value={currentTab} noPadding>
          <UserProfile user={chat?.order?.user} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
