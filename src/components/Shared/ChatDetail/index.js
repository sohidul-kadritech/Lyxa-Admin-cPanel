import { Avatar, Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
// import OrderDetail from '../../../components/Shared/OrderDetail';
import Chat from './Chat';
import ChatOrderDetail from './Detail';
import UserProfile from './UserProfile';

const showingForToTabValuesMap = {
  ongoing: {
    chat: 0,
    order: 1,
    profile: 2,
    lables: ['Chat', 'Order Details', 'Profile'],
  },
  pastOrder: {
    order: 0,
    chat: 1,
    profile: 2,
    lables: ['Order Details', 'Chat', 'Profile'],
  },
  pastAccount: {
    chat: 1,
    order: 0,
    lables: ['Chat', 'Order Details'],
  },
};

export default function ChatDetails({ chat, onClose, showingFor }) {
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setCurrentTab(0);
  }, [showingFor]);

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
        {showingForToTabValuesMap[showingFor]?.lables?.map((label, index) => (
          <Tab label={label} key={index} />
        ))}
      </Tabs>
      <Box pt={7.5} flex={1}>
        <TabPanel
          index={showingForToTabValuesMap[showingFor].chat}
          value={currentTab}
          sx={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}
        >
          <Chat order={chat?.order} />
        </TabPanel>
        <TabPanel index={showingForToTabValuesMap[showingFor].order} value={currentTab} noPadding>
          <ChatOrderDetail order={chat?.order} />
        </TabPanel>
        <TabPanel index={showingForToTabValuesMap[showingFor].profile} value={currentTab} noPadding>
          <UserProfile user={chat?.order?.user} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
