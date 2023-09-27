/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import socketServices from '../../common/socketService';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import StyledBadgeContainer from '../../components/Styled/StyledBadge';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { statusColor } from '../ShopProfile/Info';
import SlideInContainer from './SlideInContainer';
import UrgentOrderTable from './UrgentOrders';

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState(location?.search === '?urgent-order' ? 2 : 0);
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

  const urgentOrderQuery = useQuery(
    [
      Api.URGENT_ORDER_COUNT,
      {
        assignedCustomerService: currentUser?.admin?.adminType === 'customerService' ? currentUser?.admin?._id : '',
        currentTab,
      },
    ],
    () =>
      AXIOS.get(Api.URGENT_ORDER_COUNT, {
        params: {
          assignedCustomerService: currentUser?.admin?.adminType === 'customerService' ? currentUser?.admin?._id : '',
        },
      })
  );

  console.log('urgentOrderQuery?.data?.data?.urgentOrderCount', urgentOrderQuery?.data?.data?.urgentOrderCount);

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
        setOrdersList((prev) => {
          const findSelectedChat = prev?.filter((chat) => chat?._id === selectedChat?._id);

          if (!findSelectedChat?.length) {
            setSelectedChat({});
            setSidebarOpen(false);
          }

          return prev?.filter((chat) => chat?._id !== data?._id);
        });
      } else {
        setAccountsList((prev) => {
          const findSelectedChat = prev?.filter((chat) => chat?._id === selectedChat?._id);

          if (!findSelectedChat?.length) {
            setSelectedChat({});
            setSidebarOpen(false);
          }

          return prev?.filter((chat) => chat?._id !== data?._id);
        });
      }
    });

    return () => {
      socketServices?.removeListener(`user_send_chat_request`);
      socketServices?.removeListener(`admin_accepted_chat_remove`);
    };
  }, []);

  const onViewDetails = (chat) => {
    console.log('chat', chat);
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
              statusColor: admin?.liveStatus === 'online' ? statusColor?.green : statusColor?.black,
            }}
            avatarProps={{
              sx: { width: 70, height: 70 },
            }}
            containerProps={{ sx: { gap: 5 } }}
            showFor="customerService"
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
            {/* <StyledBadgeContainer badgeContent={1}> */}
            <Tab
              label={
                <StyledBadgeContainer
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 3,
                      top: 10,
                      padding: '0 4px',
                    },
                  }}
                  badgeContent={urgentOrderQuery?.data?.data?.urgentOrderCount || 0}
                >
                  Urgent Orders {urgentOrderQuery?.data?.data?.urgentOrderCount > 0 ? <>&nbsp; &nbsp;&nbsp;</> : ''}
                </StyledBadgeContainer>
              }
            />
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

            <TabPanel index={2} noPadding value={currentTab}>
              <UrgentOrderTable />
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
