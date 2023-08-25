/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
// import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Table from './Table';

const getTabOptions = (type) => {
  const tabsOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'butler', label: 'Butler' },
  ];

  if (type === 'scheduled') return tabsOptions.filter((option) => option.value !== 'butler');

  return tabsOptions;
};

const getCurrentTab = (queryParams) => {
  if (queryParams?.model === 'butler') return 'butler';
  if (queryParams?.model === '') return 'all';
  return queryParams?.orderType;
};

export default function Orders({ queryParams, setQueryParams }) {
  const [totalPage, setTotalPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(getCurrentTab(queryParams));

  const ordersQuery = useQuery(
    [Api.ORDER_LIST, queryParams],
    () =>
      AXIOS.get(Api.ORDER_LIST, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    },
  );

  return (
    <Box pt={7.5}>
      <StyledTabs2
        value={currentTab}
        options={getTabOptions(queryParams?.type)}
        onChange={(value) => {
          setCurrentTab(value);
          if (value === 'all') setQueryParams((prev) => ({ ...prev, orderType: value, model: '', page: 1 }));
          else if (value === 'butler') setQueryParams((prev) => ({ ...prev, orderType: '', model: value, page: 1 }));
          else setQueryParams((prev) => ({ ...prev, orderType: value, model: 'order', page: 1 }));
        }}
      />
      <Box pt={7.5} pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search orders"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchDefaultValue={queryParams?.searchKey}
          showFilters={{
            search: true,
            sort: true,
            date: true,
          }}
        />
      </Box>
      <Table
        loading={ordersQuery?.isLoading}
        refetching={ordersQuery?.isFetching}
        orderType={queryParams?.type}
        shopType={currentTab}
        orders={ordersQuery?.data?.data?.orders}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        totalPage={totalPage}
      />
    </Box>
  );
}
