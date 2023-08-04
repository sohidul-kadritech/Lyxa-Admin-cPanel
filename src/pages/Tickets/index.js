import { Box, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import TicketTable from './Table';
import { getMockData } from './mock';

export const queryParamsInit = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  startDate: moment().subtract(7, 'days'),
  endDate: moment(),
  searchKey: '',
  status: '',
};

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Closed', value: 'closed' },
];

const tabValueToTicketTypeMap = { 0: 'order', 1: 'account' };

export default function Tickets() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [currentTab, setCurrentTab] = useState(0);

  const query = useQuery([Api.ADMIN_ORDER_CHATS, queryParams], () =>
    AXIOS.get(Api.ADMIN_ORDER_CHATS, {
      params: queryParams,
    })
  );

  console.log(query?.data);

  return (
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
      <TicketTable rows={getMockData()} ticketType={tabValueToTicketTypeMap[currentTab]} />
    </Box>
  );
}
