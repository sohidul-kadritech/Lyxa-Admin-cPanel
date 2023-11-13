/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import socketServices from '../../common/socketService';
import TabPanel from '../../components/Common/TabPanel';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import StyledBadgeContainer from '../../components/Styled/StyledBadge';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SlideInContainer from './SlideInContainer';
import UrgentOrderTable from './UrgentOrders';

const defaultSearchParams = {
  currentTab: 0,
};

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();

  const [queryParams, setQueryParams] = useQueryParams(defaultSearchParams);

  const { admin } = currentUser;

  const history = useHistory();
  const location = useLocation();

  const [, setRender] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedChat, setSelectedChat] = useState({});

  const [newChatList, setNewChatList] = useState([]);

  const [ordersList, setOrdersList] = useState([]);

  const [accountsList, setAccountsList] = useState([]);

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    if (location?.pathname === '/ongoing-tickets') {
      if (searchParams.get('currentTab') === '1') {
        const chat = ordersList?.find((item) => item?._id === location?.state?.message?._id);
        if (chat) {
          setSidebarOpen(true);
          history.push({
            pathname: location?.pathname,
            search: location?.search,
          });

          setSelectedChat(chat);
        }
      } else if (searchParams.get('currentTab') === '2') {
        const chat = accountsList?.find((item) => item?._id === location?.state?.message?._id);

        if (chat) {
          setSidebarOpen(true);
          history.push({
            pathname: location?.pathname,
            search: location?.search,
          });
          setSelectedChat(chat);
        }
      } else if (searchParams.get('currentTab') === '3' || searchParams.get('currentTab') === '4') {
        setSidebarOpen(false);
      }
    }
  }, [queryParams?.currentTab, location, ordersList, accountsList]);

  const newRequestquery = useQuery([Api.NEW_CHATS, { ...queryParams }], () => AXIOS.get(Api.NEW_CHATS), {
    onSuccess: (data) => {
      setNewChatList(data?.data?.list);
    },
  });

  const ordersQuery = useQuery(
    [Api.ONGOING_CHATS, { chatType: 'order', ...queryParams }],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: { chatType: 'order' },
      }),
    {
      onSuccess: (data) => {
        setOrdersList(data?.data?.list);
      },
    },
  );

  const accountsQuery = useQuery(
    [Api.ONGOING_CHATS, { chatType: 'account', ...queryParams }],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: { chatType: 'account' },
      }),
    {
      onSuccess: (data) => {
        setAccountsList(data?.data?.list);
      },
    },
  );

  // urgent order count
  const urgentOrderCountQuery = useQuery(
    [
      Api.URGENT_ORDER_COUNT,
      {
        assignedCustomerService: currentUser?.admin?.adminType === 'customerService' ? currentUser?.admin?._id : '',
        ...queryParams,
      },
    ],
    () =>
      AXIOS.get(Api.URGENT_ORDER_COUNT, {
        params: {
          assignedCustomerService: currentUser?.admin?.adminType === 'customerService' ? currentUser?.admin?._id : '',
        },
      }),
  );

  // late order count
  const lateOrderCountQuery = useQuery([Api.LATE_ORDER_COUNT, { ...queryParams }], () =>
    AXIOS.get(Api.LATE_ORDER_COUNT),
  );

  // realtime add and remove chats
  useEffect(() => {
    socketServices.on('user_send_chat_request', (data) => {
      successMsg(`New chat request from ${data?.user?.name}`, 'success');
      setNewChatList((prev) => [data, ...prev]);
      // if (data?.chatType === 'order') {
      //   setOrdersList((prev) => [data, ...prev]);
      // } else {
      //   setAccountsList((prev) => [data, ...prev]);
      // }
    });

    socketServices.on('admin_accepted_chat_remove', (data) => {
      if (data?.admin?._id === admin?._id) {
        return;
      }

      if (selectedChat?._id === data?._id) {
        selectedChat.acceptedByOther = true;
      }

      setNewChatList((prev) => {
        const findSelectedChat = prev?.filter((chat) => chat?._id === selectedChat?._id);

        if (!findSelectedChat?.length) {
          setSelectedChat({});
          setSidebarOpen(false);
        }

        return prev?.filter((chat) => chat?._id !== data?._id);
      });
    });

    return () => {
      socketServices?.removeListener(`user_send_chat_request`);
      socketServices?.removeListener(`admin_accepted_chat_remove`);
    };
  }, []);

  const onViewDetails = (chat) => {
    setSelectedChat((prev) => chat);
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
          {/* <Typography variant="h4" pb={10}>
            Dashboard
          </Typography> */}
          {/* <UserProfileInfo
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
          /> */}

          <Tabs
            value={Number(queryParams?.currentTab)}
            onChange={(event, newValue) => {
              if (newValue < 3) {
                setQueryParams({ currentTab: newValue });
                return;
              }

              if (newValue === 3) {
                setQueryParams({ currentTab: newValue, type: 'ongoing', page: 1, errorOrderType: 'urgent' });
              }

              if (newValue === 4) {
                setQueryParams({ currentTab: newValue, type: 'ongoing', page: 1, errorOrderType: 'late' });
              }
            }}
            sx={{
              paddingTop: '40px',
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="New Tickets" />
            <Tab label="Orders Tickets" />
            <Tab label="Account Tickets" />
            <Tab
              label={
                <StyledBadgeContainer
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 3,
                      top: 10,
                      padding: '4px 4px',
                    },
                  }}
                  color="primary"
                  badgeContent={urgentOrderCountQuery?.data?.data?.urgentOrderCount || 0}
                >
                  Urgent Orders{' '}
                  {urgentOrderCountQuery?.data?.data?.urgentOrderCount > 0 ? <>&nbsp; &nbsp;&nbsp;</> : ''}
                </StyledBadgeContainer>
              }
            />
            <Tab
              label={
                <StyledBadgeContainer
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 3,
                      top: 10,
                      padding: '4px 4px',
                    },
                  }}
                  badgeContent={lateOrderCountQuery?.data?.data?.lateOrderCount || 0}
                  color="primary"
                >
                  Late Orders {lateOrderCountQuery?.data?.data?.lateOrderCount > 0 ? <>&nbsp; &nbsp;&nbsp;</> : ''}
                </StyledBadgeContainer>
              }
            />
          </Tabs>
          <Box pt={9}>
            <TabPanel index={0} noPadding value={Number(queryParams?.currentTab)}>
              <ChatList
                hidePagination
                refetching={false}
                onViewDetails={onViewDetails}
                chats={newChatList}
                loading={newRequestquery?.isLoading}
                onAction={onAction}
                showThreedots={false}
              />
            </TabPanel>
            <TabPanel index={1} noPadding value={Number(queryParams?.currentTab)}>
              <ChatList
                hidePagination
                refetching={false}
                onViewDetails={onViewDetails}
                chats={ordersList}
                loading={ordersQuery?.isLoading}
                onAction={onAction}
                showThreedots
              />
            </TabPanel>
            <TabPanel index={2} noPadding value={Number(queryParams?.currentTab)}>
              <ChatList
                hidePagination
                refetching={false}
                onViewDetails={onViewDetails}
                chats={accountsList}
                loading={accountsQuery?.isLoading}
                onAction={onAction}
                showThreedots
              />
            </TabPanel>

            <TabPanel index={3} noPadding value={Number(queryParams?.currentTab)}>
              <UrgentOrderTable />
            </TabPanel>
            <TabPanel index={4} noPadding value={Number(queryParams?.currentTab)}>
              <UrgentOrderTable api={Api.ORDER_LIST} type="late" showFor="admin" />
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
