/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from './Searchbar';
import Table from './Table';

const queryParamsInit = {
  status: '',
  category: '',
  orderStatus: '',
  type: '',
  resolved: false,
  page: 1,
  pageSize: 25,
  sortBy: 'DESC',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
};

export default function Flags() {
  const [totalPage, setTotalPage] = useState(1);
  const [queryParams, setQueryParams] = useState(queryParamsInit);

  const query = useQuery(
    [Api.GET_ALL_FLAGS, queryParams],
    () => AXIOS.get(Api.GET_ALL_FLAGGED_ORDERS, { params: queryParams }),
    {
      onSuccess: (data) => {
        // console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    },
  );

  return (
    <Box pt={7.5}>
      <Box pb={7.5}>
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
        refetching={query?.isFetching}
        queryParams={queryParams}
        totalPage={totalPage}
        setQueryParams={setQueryParams}
        orders={query?.data?.data?.list}
      />
    </Box>
  );
}
