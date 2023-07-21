import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../components/Common/TabPanel';
import ChatDetails from '../../components/Shared/ChatDetail';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SlideInContainer from '../OngoingTickets/SlideInContainer';
import TicketTable from './TicketTable';
import { createChatFromOrder } from './helper';

const queryParamsInit = () => ({
  page: 1,
  pageSize: 15,
  sortBy: 'desc',
});

export default function PastTickets() {
  const [queryParams, setQueryParams] = useState(queryParamsInit());
  const [currentTab, setCurrentTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const ordersQuery = useQuery([Api.ORDER_TYPE_PAST_CHATS, queryParams], () =>
    AXIOS.get(Api.ORDER_TYPE_PAST_CHATS, {
      params: queryParams,
    })
  );

  const accountsQuery = useQuery([Api.ACCOUNT_TYPE_PAST_CHATS, queryParams], () =>
    AXIOS.get(Api.ACCOUNT_TYPE_PAST_CHATS, {
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
              setQueryParams((prev) => ({ ...prev, page: 1 }));
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
            <TabPanel index={0} value={currentTab} noPadding>
              <TicketTable
                totalPage={ordersQuery?.data?.data?.paginate?.metadata?.page?.totalPage || 1}
                loading={ordersQuery.isLoading}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                ticketType="order"
                rows={ordersQuery?.data?.data?.list}
                onSelect={(row) => {
                  setSelectedChat(createChatFromOrder(row));
                  setSidebarOpen(true);
                }}
              />
            </TabPanel>
            <TabPanel index={1} value={currentTab} noPadding>
              <TicketTable
                totalPage={accountsQuery?.data?.data?.paginate?.metadata?.page?.totalPage || 1}
                loading={accountsQuery.isLoading}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                ticketType="account"
                rows={accountsQuery?.data?.data?.list}
                onSelect={(row) => {
                  setSidebarOpen(true);
                  setSelectedChat(row);
                }}
              />
            </TabPanel>
          </Box>
        </Box>
      </SlideInContainer>
      <SlideInContainer type="dynamic" open={sidebarOpen}>
        <ChatDetails showingFor={selectedChat?.chatType} chat={selectedChat} onClose={() => setSidebarOpen(false)} />
      </SlideInContainer>
    </Box>
  );
}
