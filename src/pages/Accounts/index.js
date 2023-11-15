/* eslint-disable no-unused-vars */
import { Box, Stack, Tab, Tabs } from '@mui/material';
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
  userType: 'normal',
};

const tabValueToIndex = {
  normal: 0,
  subscribed: 1,
  0: 'normal',
  1: 'subscribed',
};

export default function AccountList() {
  const [queryParams, setQueryParams] = useQueryParams({ ...queryParamsInit });
  const [totalPage, setTotalPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(0);
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

      {/* User searchbar */}
      <Stack pb={7.5} gap={7.5}>
        <Tabs
          value={tabValueToIndex[queryParams?.userType]}
          sx={{
            '& .MuiTab-root': {
              padding: '8px 12px',
              textTransform: 'none',
            },
          }}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            setQueryParams((prev) => ({ ...prev, userType: tabValueToIndex[newValue] }));
          }}
        >
          <Tab label="Normal" />
          <Tab label="Subscribed" />
        </Tabs>

        <SearchBar
          searchPlaceHolder="Search Users"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          buttonLabel="Add"
          showFilters={{ search: true, status: true, type: true, date: false, sort: true }}
        />
      </Stack>
      {/* user table */}
      <UsersTable
        users={query?.data?.data?.users}
        loading={query?.isLoading}
        totalPage={totalPage}
        showFor={queryParams?.userType}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
      />
    </Box>
  );
}
