import { Box } from '@mui/material';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import SearchBar from '../../components/Common/CommonSearchbar';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import Table from './Table';

const getQueryParamsInit = (type, searchParams) => {
  const params = {
    page: 1,
    pageSize: 20,
    sortBy: 'DESC',
    type,
    startDate: moment().startOf('month'),
    endDate: moment(),
    searchKey: '',
    orderType: 'all',
    model: '',
  };

  Object.keys(params).forEach((key) => {
    if (searchParams?.get(key)) {
      if (key === 'startDate' || key === 'endDate') params[key] = moment(searchParams.get(key), 'YYYY/MM/DD');
      else params[key] = searchParams.get(key);
    }
  });

  return params;
};

const tabsOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Restaurant' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'butler', label: 'Butler' },
];

export default function Orders({ type }) {
  const location = useLocation();
  const history = useHistory();
  const searchParams = useMemo(() => new URLSearchParams(location?.search), []);
  const [totalPage, setTotalPage] = useState(1);
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(type, searchParams));
  const [currentTab, setCurrentTab] = useState('all');

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
    }
  );

  useEffect(() => {
    history.replace({ search: '' });
  }, []);

  return (
    <Box pt={7.5}>
      <StyledTabs2
        value={currentTab}
        options={tabsOptions}
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
        orderType={type}
        shopType={currentTab}
        orders={ordersQuery?.data?.data?.orders}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        totalPage={totalPage}
      />
    </Box>
  );
}
