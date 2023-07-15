import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatList from '../../components/Shared/ChatList';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const queryParamsInit = (chatType, userId) => ({
  page: 1,
  pageSize: 10,
  sortBy: 'desc',
  chatType,
  userId,
});

const tabsOptions = [
  { value: 'order', label: 'Order' },
  { value: 'account', label: 'Account' },
];

export default function UserChatList({ userId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [queryParams, setQueryParams] = useState(queryParamsInit('order', userId));

  const query = useQuery([Api.SINGLE_USER_CHATS, queryParams], () =>
    AXIOS.get(Api.SINGLE_USER_CHATS, { params: queryParams })
  );

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2
          options={tabsOptions}
          value={queryParams.chatType}
          onChange={(value) => {
            setQueryParams((prev) => ({ ...prev, chatType: value, page: 1 }));
          }}
        />
      </Box>
      <ChatList
        chats={query?.data?.data?.list}
        loading={query?.isLoading}
        refetching={query?.isRefetching}
        page={queryParams?.page}
        setPage={(page) => setQueryParams({ ...queryParams, page })}
        totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
        onViewDetails={(chat) => {
          setSidebarOpen(true);
          setSelectedChat(chat);
        }}
      />
      <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box sx={{ width: '500px' }}>
          <ChatDetails showingFor={selectedChat?.chatType} chat={selectedChat} onClose={() => setSidebarOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
