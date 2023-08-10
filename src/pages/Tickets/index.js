import { Box, Drawer, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import ChatDetails from '../../components/Shared/ChatDetail';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { createChatFromOrder } from '../PastTickets/helper';
import TicketTable from './Table';

export const queryParamsInit = {
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  startDate: moment().subtract(7, 'days'),
  endDate: moment(),
  searchKey: '',
  status: '',
};

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Ongoing', value: 'accepted' },
  { label: 'Timeout', value: 'rejected' },
  { label: 'Resolved', value: 'closed' },
];

export default function Tickets() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [currentTab, setCurrentTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const ordersQuery = useQuery([Api.ADMIN_ORDER_CHATS, queryParams], () =>
    AXIOS.get(Api.ADMIN_ORDER_CHATS, {
      params: queryParams,
    })
  );

  const accountsQuery = useQuery([Api.ADMIN_ACCOUNT_CHATS, queryParams], () =>
    AXIOS.get(Api.ADMIN_ACCOUNT_CHATS, {
      params: queryParams,
    })
  );

  return (
    <>
      <Box pb={13}>
        <PageTop
          title="Tickets List"
          sx={{
            position: 'sticky',
            fontWeight: 700,
          }}
        />
        <Box pb={7.5}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
              setQueryParams((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <Tab label="Order" />
            <Tab label="Account" />
          </Tabs>
        </Box>
        <Box pb={7.5}>
          <SearchBar
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            searchPlaceHolder="Search"
            showFilters={{
              date: true,
              search: true,
              sort: true,
              customSelect: true,
            }}
            customSelectOptions={statusOptions}
            customSelectValue="status"
            customSelectPlaceholder="Status"
          />
        </Box>
        <Box>
          <TabPanel value={currentTab} index={0} noPadding>
            <TicketTable
              totalPage={ordersQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
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
          <TabPanel value={currentTab} index={1} noPadding>
            <TicketTable
              totalPage={accountsQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
              loading={accountsQuery.isLoading}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              ticketType="account"
              rows={accountsQuery?.data?.data?.list}
              onSelect={(row) => {
                setSelectedChat(row);
                setSidebarOpen(true);
              }}
            />
          </TabPanel>
        </Box>
      </Box>
      <Drawer open={sidebarOpen} anchor="right">
        <Box width="500px">
          <ChatDetails
            showingFor={selectedChat?.chatType}
            chat={selectedChat}
            onClose={() => setSidebarOpen(false)}
            readOnly
          />
        </Box>
      </Drawer>
    </>
  );
}
