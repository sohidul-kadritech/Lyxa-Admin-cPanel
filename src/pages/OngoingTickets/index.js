/* eslint-disable max-len */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import socketServices from '../../common/socketService';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SlideInContainer from './SlideInContainer';

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;

  const [currentTab, setCurrentTab] = useState(0);
  const [, setRender] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const [ordersList, setOrdersList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);

  const ordersQuery = useQuery(
    [Api.ONGOING_CHATS, { chatType: 'order' }],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: { chatType: 'order' },
      }),
    {
      onSuccess: (data) => {
        setOrdersList(data?.data?.list);
        console.log(data);
      },
    }
  );

  const accountsQuery = useQuery(
    [Api.ONGOING_CHATS, { chatType: 'account' }],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: { chatType: 'account' },
      }),
    {
      onSuccess: (data) => {
        setAccountsList(data?.data?.list);
        console.log(data);
      },
    }
  );

  // realtime add and remove chats
  useEffect(() => {
    socketServices.on('user_send_chat_request', (data) => {
      successMsg(`New chat request from ${data?.user?.name}`, 'success');
      console.log('add-chat', data);
      if (data?.chatType === 'order') {
        setOrdersList((prev) => [data, ...prev]);
      } else {
        setAccountsList((prev) => [data, ...prev]);
      }
    });

    socketServices.on('admin_accepted_chat_remove', (data) => {
      console.log('remove-chat', data);

      if (data?.admin?._id === admin?._id) {
        return;
      }

      if (selectedChat?._id === data?._id) {
        selectedChat.acceptedByOther = true;
      }

      if (data?.chatType === 'order') {
        setOrdersList((prev) => prev?.filter((chat) => chat?._id !== data?._id));
      } else {
        setAccountsList((prev) => prev?.filter((chat) => chat?._id !== data?._id));
      }
    });

    return () => {
      socketServices?.removeListener(`user_send_chat_request`);
      socketServices?.removeListener(`admin_accepted_chat_remove`);
    };
  }, []);

  const onViewDetails = (chat) => {
    setSelectedChat(chat);
    setSidebarOpen(true);
  };

  const updateSelectedChatOrder = (newOrderResponse) => {
    if (newOrderResponse?.status && newOrderResponse?.data?.order?._id === selectedChat?.order?._id) {
      selectedChat.order = newOrderResponse?.data?.order;
      setRender((prev) => !prev);
    }
  };

  const onAction = (actionType, newData) => {
    if (actionType === 'resolve' && newData?._id === selectedChat?._id) setSidebarOpen(false);

    if (actionType === 'flag' || actionType === 'cancelOrder' || actionType === 'updateStatus')
      updateSelectedChatOrder(newData);
  };

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
            <TabPanel index={0} noPadding value={currentTab}>
              <ChatList
                hidePagination
                refetching={false}
                onViewDetails={onViewDetails}
                chats={ordersList}
                loading={ordersQuery?.isLoading}
                onAction={onAction}
              />
            </TabPanel>
            <TabPanel index={1} noPadding value={currentTab}>
              <ChatList
                hidePagination
                refetching={false}
                onViewDetails={onViewDetails}
                chats={accountsList}
                loading={accountsQuery?.isLoading}
                onAction={onAction}
              />
            </TabPanel>
          </Box>
        </SlideInContainer>
      </Box>
      {/* sidebar */}
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails
          showingFor={selectedChat?.chatType}
          chat={selectedChat}
          onClose={() => setSidebarOpen(false)}
          onAcceptChat={() => setRender((prev) => !prev)}
        />
      </SlideInContainer>
    </Box>
  );
}
