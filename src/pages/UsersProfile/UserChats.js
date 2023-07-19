import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../components/Common/TabPanel';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const queryParamsInit = (chatType, userId) => ({
  page: 1,
  pageSize: 10,
  sortBy: 'desc',
  userId,
});

const tabsOptions = [
  { value: 0, label: 'Order' },
  { value: 1, label: 'Account' },
];

export default function UserChatList({ userId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [queryParams, setQueryParams] = useState(queryParamsInit('order', userId));
  const [currentTab, setCurrentTab] = useState(0);

  const ordersQuery = useQuery([Api.SINGLE_USER_ORDER_CHATS, queryParams], () =>
    AXIOS.get(Api.SINGLE_USER_ORDER_CHATS, { params: queryParams })
  );

  const accountsQuery = useQuery([Api.SINGLE_USER_ACCOUNTS_CHATS, queryParams], () =>
    AXIOS.get(Api.SINGLE_USER_ACCOUNTS_CHATS, { params: queryParams })
  );

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2
          options={tabsOptions}
          value={currentTab}
          onChange={(value) => {
            setCurrentTab(value);
            setQueryParams((prev) => ({ ...prev, page: 1 }));
          }}
        />
      </Box>
      <Box>
        <TabPanel value={currentTab} index={0} noPadding>
          <ChatList
            chats={ordersQuery?.data?.data?.list}
            loading={ordersQuery?.isLoading}
            refetching={ordersQuery?.isRefetching}
            page={queryParams?.page}
            setPage={(page) => setQueryParams({ ...queryParams, page })}
            totalPage={ordersQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
            onViewDetails={(chat) => {
              setSidebarOpen(true);
              setSelectedChat(chat);
            }}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1} noPadding>
          <ChatList
            chats={accountsQuery?.data?.data?.list}
            loading={accountsQuery?.isLoading}
            refetching={accountsQuery?.isRefetching}
            page={queryParams?.page}
            setPage={(page) => setQueryParams({ ...queryParams, page })}
            totalPage={accountsQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
            onViewDetails={(chat) => {
              setSidebarOpen(true);
              setSelectedChat(chat);
            }}
          />
        </TabPanel>
      </Box>
      <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box sx={{ width: '500px' }}>
          <ChatDetails showingFor={selectedChat?.chatType} chat={selectedChat} onClose={() => setSidebarOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
