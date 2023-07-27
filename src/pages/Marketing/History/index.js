import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import SearchBar from '../../../components/Common/CommonSearchbar';
import MarketingHistoryTable from './Table';
import { mockHistory } from './mock';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: '',
  startDate: moment().startOf('month'),
  endDate: moment(),
  searchKey: '',
  status: '',
};

export default function MarketingHistory() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  return (
    <Box>
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
      <MarketingHistoryTable rows={mockHistory} loading={false} />
    </Box>
  );
}
