/* eslint-disable no-unused-vars */
import { Box, Drawer } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import UsersTable from './Table';

const queryParamsInit = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  type: 'ongoing',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  status: '',
};

export default function AccountList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [totalPage, setTotalPage] = useState(1);

  const query = useQuery(
    [Api.ALL_USERS, queryParams],
    () =>
      AXIOS.get(Api.ALL_USERS, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box pb={9}>
      <PageTop title="Accounts" />
      <Box pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search accounts"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          buttonLabel="Add"
        />
      </Box>
      <UsersTable
        users={query?.data?.data?.users}
        loading={query?.isLoading}
        totalPage={totalPage}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
      />
      <Drawer open={Boolean(sidebarOpen)} anchor="right">
        <Box></Box>
      </Drawer>
    </Box>
  );
}
