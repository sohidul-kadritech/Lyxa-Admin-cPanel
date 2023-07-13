import { Avatar, Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
import Chat from './Chat';
import ChatOrderDetail from './OrderDetail';
import UserDetails from './UserDetails';

const showingForToTabValuesMap = {
  order: {
    chat: 0,
    order: 1,
    profile: 2,
    labels: ['Chat', 'Order Details', 'Profile'],
  },
  account: {
    chat: 0,
    order: 2,
    profile: 1,
    labels: ['Chat', 'Profile'],
  },
};

export default function ChatDetails({ chat, onClose, showingFor, onAcceptChat = () => {} }) {
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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={3}>
          <Avatar alt="user-image" src={chat?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
            {chat?.user?.name?.charAt(0)}
          </Avatar>
          <Stack gap={0.5}>
            <Typography variant="body4">{chat?.user?.name}</Typography>
            <Typography variant="body4" color="#737373">
              {chat?.user?.orderCompleted} orders
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10} pb={6}>
        <Typography variant="h5" fontSize={17} lineHeight="21px" fontWeight={700}>
          Order# {chat?.order?.orderId}
        </Typography>
        <Typography
          variant="h5"
          fontSize={12}
          lineHeight="20px"
          sx={{
            flexShrink: 0,
          }}
        >
          {moment(chat?.order?.createdAt).format('ddd DD, MMM, YYYY')}
        </Typography>
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
        {showingForToTabValuesMap[showingFor]?.labels?.map((label, index) => (
          <Tab label={label} key={index} />
        ))}
      </Tabs>
      <Box pt={7.5} flex={1}>
        <TabPanel
          index={showingForToTabValuesMap[showingFor].chat}
          value={currentTab}
          sx={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}
        >
          <Chat chat={chat} onClose={onClose} onAcceptChat={onAcceptChat} />
        </TabPanel>
        <TabPanel index={showingForToTabValuesMap[showingFor].order} value={currentTab} noPadding>
          <ChatOrderDetail order={chat?.order} />
        </TabPanel>
        <TabPanel index={showingForToTabValuesMap[showingFor].profile} value={currentTab} noPadding>
          <UserDetails user={chat?.user} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
