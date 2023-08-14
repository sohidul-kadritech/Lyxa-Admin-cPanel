/* eslint-disable max-len */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SlideInContainer from './SlideInContainer';

const queryParamsInit = {
  page: 1,
  pageSize: 10,
  chatType: 'order',
};

const tabValueToChatTypeMap = { 0: 'order', 1: 'account' };

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;

  const [currentTab, setCurrentTab] = useState(0);
  const [, setRender] = useState(false);

  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const query = useQuery([Api.ONGOING_CHATS, queryParams], () =>
    AXIOS.get(Api.ONGOING_CHATS, {
      params: queryParams,
    })
  );

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
              setQueryParams((prev) => ({ ...prev, chatType: tabValueToChatTypeMap[newValue] }));
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
            <ChatList
              page={queryParams?.page}
              setPage={(page) => setQueryParams((prev) => ({ ...prev, page }))}
              totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
              refetching={query?.isFetching}
              onViewDetails={onViewDetails}
              chats={query?.data?.data?.list}
              loading={query?.isLoading}
              onAction={onAction}
            />
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
