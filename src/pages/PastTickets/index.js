import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChatDetails from '../../components/Shared/ChatDetail';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SlideInContainer from '../OngoingTickets/SlideInContainer';
import TicketTable from './TicketTable';

const queryParamsInit = (chatType) => ({
  page: 1,
  pageSize: 15,
  sortBy: 'desc',
  chatType,
});

const tabValueToChatTypeMap = { 0: 'order', 1: 'account' };

export default function PastTickets() {
  const [queryParams, setQueryParams] = useState(queryParamsInit('order'));
  const [currentTab, setCurrentTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const query = useQuery([Api.PAST_CHATS, queryParams], () =>
    AXIOS.get(Api.PAST_CHATS, {
      params: queryParams,
    })
  );

  return (
    <Box
      sx={{
        height: 'calc(100vh - 83px)',
        maxWidth: 'calc(100vw - 100px)',
      }}
    >
      <SlideInContainer type="static" open={sidebarOpen}>
        <Box
          pt={9}
          pb={9}
          sx={{
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <Typography variant="h4" pb={10}>
            Dashboard
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
              setQueryParams((prev) => ({ ...prev, chatType: tabValueToChatTypeMap[newValue], page: 1 }));
            }}
            sx={{
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Orders" />
            <Tab label="Account" />
          </Tabs>
          <Box pt={9}>
            <TicketTable
              totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage || 1}
              loading={query.isLoading}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              ticketType="order"
              rows={query?.data?.data?.list}
              onSelect={(row) => {
                console.log({ row });
                setSidebarOpen(true);
                setSelectedChat(row);
              }}
            />
          </Box>
        </Box>
      </SlideInContainer>
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails showingFor={selectedChat?.chatType} chat={selectedChat} onClose={() => setSidebarOpen(false)} />
      </SlideInContainer>
    </Box>
  );
}
