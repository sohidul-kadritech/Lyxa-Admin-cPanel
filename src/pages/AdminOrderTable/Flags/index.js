import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from './Searchbar';
import Table from './Table';

const tabsOptions = [
  { value: 'unresolved', label: 'Unresolved' },
  { value: 'resolved', label: 'Resolve' },
];

const queryParamsInit = {
  category: '',
  orderStatus: '',
  type: '',
  resolved: false,
  page: 1,
  pageSize: 25,
  sortBy: '',
  startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
};

export default function Flags() {
  const [totalPage, setTotalPage] = useState(1);
  const [queryParams, setQueryParams] = useState(queryParamsInit);
  const [currentTab, setCurrentTab] = useState('unresolved');

  const query = useQuery(
    [Api.GET_ALL_FLAGS, queryParams],
    () => AXIOS.get(Api.GET_ALL_FLAGGED_ORDERS, { params: queryParams }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box pt={7.5}>
      <StyledTabs2
        value={currentTab}
        options={tabsOptions}
        onChange={(value) => {
          setCurrentTab(value);
          setQueryParams((prev) => ({ ...prev, resolved: value === 'resolved', page: 1 }));
        }}
      />
      <Box pt={7.5} pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search flags"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          hideFilters={{
            button: true,
            status: true,
          }}
        />
      </Box>
      <Table
        loading={query?.isLoading}
        queryParams={queryParams}
        totalPage={totalPage}
        setQueryParams={setQueryParams}
        orders={query?.data?.data?.list}
      />
    </Box>
  );
}
