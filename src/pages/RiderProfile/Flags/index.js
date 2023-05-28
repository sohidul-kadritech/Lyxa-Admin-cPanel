import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import SearchBar from './Searchbar';
import FlagsTable from './Table';
import { getMockFlags } from './mock';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  shop: '',
  orderType: 'all',
  model: 'order',
};

export default function RiderFlags() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  return (
    <Box>
      <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
      <FlagsTable rows={getMockFlags(10)} />
    </Box>
  );
}
