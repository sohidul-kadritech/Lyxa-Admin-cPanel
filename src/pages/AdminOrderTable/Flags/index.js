/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import Table from './Table';

const tabsOptions = [
  { value: 'unresolved', label: 'Unresolved' },
  { value: 'resolved', label: 'Resolve' },
];

const queryParamsInit = {
  model: '',
  type: '',
  resolved: '',
  sortBy: 'DESC',
  page: 1,
  pageSize: 25,
};

const fetchFlags = async (sortBy, flagTypeKey, resolveType, currentPage) => {
  const { data, status } = await AXIOS.get(Api.GET_ALL_FLAGS, {
    params: {
      model: '',
      type: flagTypeKey,
      resolved: resolveType,
      sortBy,
      page: currentPage,
      pageSize: 25,
    },
  });

  return status ? data : {};
};

export default function Flags() {
  const [totalPage, setTotalPage] = useState(1);
  const [queryParams, setQueryParams] = useState(queryParamsInit);
  const [currentTab, setCurrentTab] = useState('unresolved');

  const query = useQuery(
    [Api.GET_ALL_FLAGS, queryParams],
    () => AXIOS.get(Api.GET_ALL_FLAGS, { params: queryParams }),
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
