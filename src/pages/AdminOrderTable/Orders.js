/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
// import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Table from './Table';

const tabsOptionsForErrorOrder = [
  { value: 'all', label: 'All' },
  { value: 'null', label: 'Orders' },
  { value: 'urgent', label: 'Urgent Orders' },
  { value: 'late', label: 'Late Orders' },
  { value: 'replacement', label: 'Replacement' },
];

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

export default function Orders({ queryParams, setQueryParams, type }) {
  const [totalPage, setTotalPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(getCurrentTab(queryParams));
  const [currentErrorOrderTab, setCurrentErrorOrderTab] = useState('all');

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
      <Stack gap={4}>
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
        {type === 'ongoing' && (
          <StyledTabs2
            value={currentErrorOrderTab}
            options={tabsOptionsForErrorOrder}
            onChange={(value) => {
              setCurrentErrorOrderTab(value);
              if (value === 'all') {
                setQueryParams((prev) => {
                  delete prev?.errorOrderType;
                  return { ...prev, page: 1 };
                });
                return;
              }
              if (value === 'null') {
                setQueryParams((prev) => ({ ...prev, errorOrderType: null, page: 1 }));
                return;
              }

              setQueryParams((prev) => ({ ...prev, errorOrderType: value, page: 1 }));
            }}
          />
        )}
      </Stack>
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
