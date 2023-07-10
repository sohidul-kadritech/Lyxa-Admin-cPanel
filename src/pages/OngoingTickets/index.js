/* eslint-disable no-unused-vars */
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import ChatsList from './ChatsList';
import SlideInContainer from './SlideInContainer';
import { order } from './mock';

/*
page
1

pageSize
50

chatType

order || account

*/

const queryParamsInit = {
  page: 1,
  pageSize: 10,
  chatType: 'order',
};

const tabValueToChatTypeMap = { 0: 'order', 1: 'account' };

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  const chat = { order };

  const [currentTab, setCurrentTab] = useState(0);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const query = useQuery(
    [Api.ONGOING_CHATS, queryParams],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: queryParams,
      }),
    {}
  );

  const onViewDetails = (chat) => {
    setSelectedChat(chat);
    setSidebarOpen(true);
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
            <TabPanel index={0} value={currentTab} noPadding>
              <ChatsList onViewDetails={onViewDetails} chats={query?.data?.data?.list} />
            </TabPanel>
            <TabPanel index={1} value={currentTab} noPadding>
              <ChatsList onViewDetails={onViewDetails} chats={query?.data?.data?.list} />
            </TabPanel>
          </Box>
        </SlideInContainer>
      </Box>
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails showingFor="ongoing" chat={selectedChat} onClose={() => setSidebarOpen(false)} />
      </SlideInContainer>
    </Box>
  );
}
