/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
// import moment from 'moment';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import SearchBar from '../../components/Common/CommonSearchbar';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Table from './Table';

const tabsOptionsForErrorOrder = (value, value_late) => {
  const data = [
    { value: 'all', label: 'All' },
    { value: 'null', label: 'Orders' },
    { value: 'urgent', label: 'Urgent Orders', badgeContent: value },
    { value: 'late', label: 'Late Orders', badgeContent: value_late },
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
  getUrgentOrderNumber,
  api = Api.ORDER_LIST,
  urgentOrderCountParams,
  showTabs = {
    category: true,
    errorOrderType: true,
  },
}) {
  const [totalPage, setTotalPage] = useState(1);

  const [currentTab, setCurrentTab] = useState(getCurrentTab(queryParams));

  const location = useLocation();
  const history = useHistory();

  // ---------------------- -------------------------------- ---------------------------
  // When order type is ongoing we removed the date filter.
  // When order type is not ongoing we add the date filter with selected current week.
  // ---------------------- -------------------------------- ---------------------------

  useEffect(() => {
    if (type === 'ongoing') {
      setQueryParams((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
    } else {
      setQueryParams((prev) => ({
        ...prev,
        startDate: getFirstMonday('week').format('YYYY/MM/DD'),
        endDate: moment().format('YYYY/MM/DD'),
      }));
    }
  }, [type]);

  const [currentErrorOrderTab, setCurrentErrorOrderTab] = useState(
    !queryParams?.errorOrderType ? 'all' : queryParams?.errorOrderType,
  );

  const [render, setRender] = useState(false);

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
    },
  );

  const urgentOrderQuery = useQuery(
    [Api.URGENT_ORDER_COUNT, { ...queryParams }],
    () =>
      AXIOS.get(Api.URGENT_ORDER_COUNT, {
        params: {
          orderType: queryParams?.orderType,
          ...(urgentOrderCountParams || {}),
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          if (getUrgentOrderNumber) {
            getUrgentOrderNumber(data?.data?.urgentOrderCount);
          }
        }
      },
      refetchOnWindowFocus: true,
    },
  );

  const lateOrderQuery = useQuery([Api.LATE_ORDER_COUNT, { ...queryParams }], () => AXIOS.get(Api.LATE_ORDER_COUNT), {
    onSuccess: (data) => {
      if (data?.status) {
        if (getUrgentOrderNumber) {
          getUrgentOrderNumber(data?.data?.urgentOrderCount);
        }
      }
    },
    refetchOnWindowFocus: true,
  });

  return (
    <Box pt={paddingTop || 0}>
      <Stack gap={4}>
        {type === 'ongoing' && showTabs?.errorOrderType && (
          <StyledTabs2
            value={currentErrorOrderTab}
            options={tabsOptionsForErrorOrder(
              urgentOrderQuery?.data?.data?.urgentOrderCount || 0,
              lateOrderQuery?.data?.data?.lateOrderCount || 0,
            )}
            onChange={(value) => {
              setCurrentErrorOrderTab(value);
              // console.log('value', value);
              if (value === 'all') {
                setQueryParams((prev) => ({ ...prev, errorOrderType: undefined, page: 1 }));
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
            date: type !== 'ongoing',
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
        render={render}
        setRender={setRender}
      />
    </Box>
  );
}
