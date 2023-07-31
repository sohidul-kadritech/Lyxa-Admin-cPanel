import { Box, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import TicketTable from './Table';
import { getMockData } from './mock';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: '',
  startDate: moment().startOf('month'),
  endDate: moment(),
  searchKey: '',
  status: '',
};

const tabValueToTicketTypeMap = { 0: 'order', 1: 'account' };

export default function Tickets() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [currentTab, setCurrentTab] = useState(0);

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
            status: true,
          }}
        />
      </Box>
      <TicketTable rows={getMockData()} ticketType={tabValueToTicketTypeMap[currentTab]} />
    </Box>
  );
}
