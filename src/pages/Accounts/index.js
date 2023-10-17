import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import useQueryParams from '../../helpers/useQueryParams';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import UsersTable from './Table';

const queryParamsInit = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  type: 'ongoing',
  searchKey: '',
  status: '',
};

export default function AccountList() {
  const [queryParams, setQueryParams] = useQueryParams({ ...queryParamsInit });
  const [totalPage, setTotalPage] = useState(1);
  const location = useLocation();
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
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <Box pb={9}>
      <PageTop
        title="Users"
        backButtonLabel={location?.state ? location?.state?.backToLabel : undefined}
        backTo={location?.state ? location?.state?.from : undefined}
      />
      <Box pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search users"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          buttonLabel="Add"
          showFilters={{ search: true, status: true, type: true, date: false, sort: true }}
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
    </Box>
  );
}
