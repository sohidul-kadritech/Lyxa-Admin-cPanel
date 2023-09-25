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

const tabsOptionsForErrorOrder = (value) => {
  const data = [
    { value: 'all', label: 'All' },
    { value: 'null', label: 'Orders' },
    { value: 'urgent', label: 'Urgent Orders', badgeContent: value || 4 },
    { value: 'late', label: 'Late Orders' },
    { value: 'replacement', label: 'Replacement' },
  ];

  return data;
};

const getTabOptions = (type, showFor) => {
  const tabsOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'butler', label: 'Butler' },
  ];

  if (type === 'scheduled' || showFor === 'customerService')
    return tabsOptions.filter((option) => option.value !== 'butler');

  return tabsOptions;
};

const getCurrentTab = (queryParams) => {
  if (queryParams?.model === 'butler') return 'butler';
  if (queryParams?.model === '') return 'all';
  return queryParams?.orderType;
};

export default function Orders({
  queryParams,
  setQueryParams,
  type,
  paddingTop = 7.5,
  showFor = 'admin',
  api = Api.ORDER_LIST,
  showTabs = {
    category: true,
    errorOrderType: true,
  },
}) {
  const [totalPage, setTotalPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(getCurrentTab(queryParams));
  const [currentErrorOrderTab, setCurrentErrorOrderTab] = useState('all');

  const ordersQuery = useQuery(
    [api, queryParams],
    () =>
      AXIOS.get(api, {
        params: { ...queryParams, orderType: queryParams?.orderType === 'butler' ? '' : queryParams?.orderType },
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box pt={paddingTop || 0}>
      <Stack gap={4}>
        {type === 'ongoing' && showTabs?.errorOrderType && (
          <StyledTabs2
            value={currentErrorOrderTab}
            options={tabsOptionsForErrorOrder(0)}
            onChange={(value) => {
              setCurrentErrorOrderTab(value);
              // console.log('value', value);
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
      <Box pt={paddingTop || 0} pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search orders"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchDefaultValue={queryParams?.searchKey}
          customSelectOptions={getTabOptions(queryParams?.type, showFor)}
          customSelectValue="orderType"
          customSelectPlaceholder="Select category"
          customSelectHanlder={(value) => {
            if (value === 'all') setQueryParams((prev) => ({ ...prev, orderType: value, model: '', page: 1 }));
            else if (value === 'butler')
              setQueryParams((prev) => ({ ...prev, orderType: value, model: value, page: 1 }));
            else setQueryParams((prev) => ({ ...prev, orderType: value, model: 'order', page: 1 }));
          }}
          showFilters={{
            search: true,
            sort: true,
            date: true,
            customSelect: showTabs?.category === true,
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
        showFor={showFor}
      />
    </Box>
  );
}
